import useAuth from "../hooks/useAuth.ts";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/components/footer.css";
import Loading from "./Loading.tsx";
import { useSendLogOutMutation } from "../features/auth/authApiSlice.ts";
const Footer = () => {
  const navigate = useNavigate();
  const { username, roles } = useAuth();
  const { pathname } = useLocation();
  const [sendLogOut, { isLoading }] = useSendLogOutMutation();
  let goDashButton = null;
  const onGoDashClick = () => navigate("/dash");

  if (pathname !== "/dash") {
    goDashButton = <button onClick={onGoDashClick}>DashBoard</button>;
  }

  if (isLoading) {
    return <Loading />;
  }

  const content = (
    <footer>
      {goDashButton}
      <p>Current user : {username}</p>
      <p>User role : {roles.toString()}</p>
      <button onClick={sendLogOut}>Logout</button>
    </footer>
  );
  return content;
};
export default Footer;
