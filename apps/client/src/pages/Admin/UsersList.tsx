import { useGetUsersQuery } from "../../features/admin/adminApiSlice.ts";
import Loading from "../../components/Loading.tsx";
import { errTypo } from "@repo/types";
import useTitle from "../../hooks/useTitle.ts";
import SingleUserRow from "./SingleUserRow.tsx";
import "../../styles/pages/admin/userlist.css";
import { useSelector } from "react-redux";
import { selectGlobalError } from "../../features/auth/authSlice.ts";

const UsersList = () => {
  useTitle("All Users");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const msg = useSelector(selectGlobalError);

  let content;
  if (isLoading) {
    content = <Loading />;
  }
  if (isError) {
    const err = error as errTypo;
    content = <p className={"error-message"}>{err?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;
    const filteredIds = [...ids];

    const tableContent =
      ids?.length &&
      filteredIds.map((userId) => (
        <SingleUserRow key={userId} userId={userId} />
      ));

    if (filteredIds.length === 0) {
      content = <p>No Users in DataBase</p>;
    } else {
      content = (
        <section className="users-list-container">
          <p className="error-message">{msg}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Visibility</th>
                <th>Total Notes</th>
                <th>View User</th>
                <th>Delete user</th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </section>
      );
    }
  }
  return content;
};
export default UsersList;
