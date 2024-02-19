import useTitle from "../hooks/useTitle.ts";
import useAuth from "../hooks/useAuth.ts";
import {Link} from "react-router-dom";

const Dash = () => {
    useTitle("DashBoard")
    const {username, isAdmin} = useAuth()

    return (
        <section>
            <p>Welcome {username}</p>
            <p><Link to={'/dash/notes'}>View My Notes</Link></p>
            <p><Link to={'/dash/notes/new'}>Create new Note</Link></p>
            <p><Link to={'/dash/users'}>for testing</Link></p>
            {isAdmin && <p><Link to={'/dash/users'}>Manage Users</Link></p>}
            {isAdmin && <p><Link to={'/dash/AllNotes'}>View All Notes</Link></p>}
        </section>
    )
}
export default Dash