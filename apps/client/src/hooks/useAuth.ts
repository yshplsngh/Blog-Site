import { selectCurrentToken } from "../features/auth/authSlice.ts";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { payloadIn } from "@repo/types";

interface useAuthTypo {
  username: string;
  isAdmin: boolean;
  useAuthEmail: string;
  roles: string[];
}
interface jwyPayload {
  userInfo: payloadIn;
}

const useAuth = (): useAuthTypo => {
  const token: string | null = useSelector(selectCurrentToken);
  let isAdmin: boolean = false;
  let username: string = "";
  let useAuthEmail: string = "";
  if (token) {
    const decodedJwt = jwtDecode(token) as jwyPayload;
    const {
      userInfo: { name, email, roles },
    } = decodedJwt;
    isAdmin = roles.includes("admin");
    username = name;
    useAuthEmail = email;
    return { username, isAdmin, useAuthEmail, roles };
  }
  return { username, isAdmin, useAuthEmail, roles: [] };
};
export default useAuth;
