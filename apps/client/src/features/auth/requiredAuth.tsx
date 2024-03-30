import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.ts";
import { FC } from "react";

// import {Outlet} from "react-router-dom"; // Assuming you have a type for roles

interface Props {
  allowedRoles: string[]; // Define the type for allowedRoles
}

const RequiredAuth: FC<Props> = ({ allowedRoles }) => {
  const { roles } = useAuth();
  const location = useLocation();

  return roles.some((role: string) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : allowedRoles.includes("admin") && roles.includes("people") ? (
    <Navigate to={"/Restricted"} replace state={{ from: location }} />
  ) : (
    <Navigate to={"/login"} replace state={{ from: location }} />
  );
};

export default RequiredAuth;
