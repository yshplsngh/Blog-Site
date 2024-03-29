import { Link } from "react-router-dom";
import "../styles/pages/home.css";
import useAuth from "../hooks/useAuth.ts";
import React from "react";
import { useSendLogOutMutation } from "../features/auth/authApiSlice.ts";
import Loading from "../components/Loading.tsx";
import useTitle from "../hooks/useTitle.ts";
import { Button } from "@repo/ui/button";

const Home = () => {
  const { username, isAdmin } = useAuth();
  const [sendLogOut, { isLoading }] = useSendLogOutMutation();
  useTitle("Home");

  const content: React.ReactElement = (
    <div className="home-links">
      <Link to="/login" className="login">
        Login
      </Link>
      <Link to="/signup" className="signup">
        Register
      </Link>
      <Button />
    </div>
  );

  if (username) {
    return (
      <div className="home-container">
        <h1>Landing page</h1>
        <Link to={"/dash"} className={"link"}>
          DashBoard
        </Link>
        <button onClick={sendLogOut} className={"logoutBut"}>
          Logout
        </button>
        {isAdmin && <p>Welcome Back Admin {username}</p>}
        {!isAdmin && <p>Welcome User {username}</p>}
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return content;
};

export default Home;
