import useAuth from "../hooks/useAuth.ts";
import {useLocation, useNavigate} from "react-router-dom";
import '../styles/components/footer.css'
const Footer = ()=>{
    const navigate = useNavigate();
    const {username,roles} = useAuth();
    const {pathname} = useLocation()

    let goDashButton = null;
    const onGoDashClick = () => navigate('/dash')

    if(pathname!=='/dash'){
        goDashButton = (
            <button onClick={onGoDashClick}>
                DashBoard
            </button>
        )
    }

    const content = (
        <footer>
            {goDashButton}
            <p>Current user : {username}</p>
            <p>User role : {roles.toString()}</p>
        </footer>
    )
    return content
}
export default Footer