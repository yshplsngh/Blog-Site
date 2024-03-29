import { useSelector } from "react-redux";
import { RootState } from "../../App/store.ts";
import { selectUserById } from "../../features/admin/adminApiSlice.ts";
import { resUsersArrayType } from "@repo/types";
import { useNavigate, useParams } from "react-router-dom";

const ViewUserDetail = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = useSelector((state: RootState) =>
    selectUserById(state, String(userId)),
  ) as resUsersArrayType;

  const handleViewNote = async () => {
    // navigate('/dash/users/detail/viewAllNotes',{state:{email:user.email}})
    navigate(`/dash/users/detail/viewAllNotes/${userId}`);
  };
  if (user as resUsersArrayType) {
    const created: string = new Date(user.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });
    return (
      <div>
        <h3>Name: {user.name}</h3>
        <h3>Email: {user.email}</h3>
        <h3>Total Notes: {user.notes.length}</h3>
        <h3>Roles: {user.roles.toString()}</h3>
        <h3>
          Status:{" "}
          {user.isActive ? (
            <span className={"activeUser"}>Active</span>
          ) : (
            <span className={"blockedUser"}>Blocked</span>
          )}
        </h3>
        <h3>User Created: {created}</h3>

        <button onClick={handleViewNote}>View All notes</button>
      </div>
    );
  } else return <h1>not found in user detail</h1>;
};
export default ViewUserDetail;
