import useTitle from "../hooks/useTitle.ts";
import useAuth from "../hooks/useAuth.ts";
import {Link} from "react-router-dom";

const Dash = ()=>{
    useTitle("DashBoard")
    const {username,isAdmin} = useAuth()

    const content = (
        <section>
            {/*normal people*/}
            <p>Welcome {username}</p>
            <p><Link to={'/dash/notes'}>View all Notes</Link></p>
            <p><Link to={'/dash/notes/new'}>Create new Note</Link></p>

            {/*admin*/}
            {isAdmin && <p><Link to={'/dash/users'}>Manage Users</Link></p>}
        </section>
    )

    return content
}
export default Dash