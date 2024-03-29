import {selectCurrentToken} from "../features/auth/authSlice.ts";
import { useSelector} from "react-redux";
import {jwtDecode} from 'jwt-decode'
import {payloadIn} from "../Types/hooksType.ts";
interface useAuthTypo{
    username:string
    isAdmin:boolean
    useAuthEmail:string
    roles:string[]
}
const useAuth = ():useAuthTypo=>{
    const token:string|null = useSelector(selectCurrentToken);
    let isAdmin:boolean=false
    let username:string=""
    let useAuthEmail:string=""
    if(token){
        const decodedJwt:payloadIn = jwtDecode(token) as payloadIn
        const {userInfo:{name,email,roles}} = decodedJwt as payloadIn;
        isAdmin = roles.includes('admin')
        username = name;
        useAuthEmail = email;
        return { username,isAdmin,useAuthEmail,roles}
    }
    return {username,isAdmin,useAuthEmail,roles:[]};
}
export default useAuth
