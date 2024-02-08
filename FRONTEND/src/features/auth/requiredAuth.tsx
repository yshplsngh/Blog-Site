import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.ts";
import {FC} from "react";
// import {Outlet} from "react-router-dom"; // Assuming you have a type for roles

interface Props {
    allowedRoles: string[]; // Define the type for allowedRoles
}

const RequiredAuth:FC<Props> = ({ allowedRoles }) => {
    const { roles } = useAuth();
    const location = useLocation();

    const content = roles.some((role:string) => allowedRoles.includes(role)) ? (
        <Outlet />
    ) : (
        <Navigate to={'/login'} replace state={{ from: location }} />
    );
    return content;
};

export default RequiredAuth;
