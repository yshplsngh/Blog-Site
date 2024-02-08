import {selectCurrentToken} from "../features/auth/authSlice.ts";
import { useSelector} from "react-redux";
import {jwtDecode} from 'jwt-decode'
import {payloadIn} from "../Types/hooksType.ts";
interface useAuthTypo{
    username:string
    isAdmin:boolean
    email:string
    roles:string[]
}
const useAuth = ():useAuthTypo=>{
    const token:string|null = useSelector(selectCurrentToken);
    let isAdmin:boolean=false
    let username:string=""
    if(token){
        const decodedJwt:payloadIn = jwtDecode(token) as payloadIn
        console.log(decodedJwt);
        const {userInfo:{name,email,roles}} = decodedJwt as payloadIn;
        isAdmin = roles.includes('admin')
        username = name;

        return { username,isAdmin,email,roles}
    }
    return {username,isAdmin,email:'',roles:[]};
}
export default useAuth
