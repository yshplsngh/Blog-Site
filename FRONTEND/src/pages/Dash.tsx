import useTitle from "../hooks/useTitle.ts";
import useAuth from "../hooks/useAuth.ts";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUserIds} from "../features/admin/adminApiSlice.ts";
import {RootState} from "../App/store.ts";
import {EntityId} from "@reduxjs/toolkit";
import {ownSelector} from "../features/Note/selector.ts";

const Dash = () => {
    useTitle("DashBoard")
    const {username, isAdmin,useAuthEmail} = useAuth()
    const {selectNoteIds}= ownSelector(useAuthEmail)

    const users:EntityId[] = useSelector((state:RootState)=>selectUserIds(state))
    const notes:EntityId[] = useSelector((state:RootState) => selectNoteIds(state))
    const forAdmin = (
        <section>
            <h2>Total Users: {users.length}</h2>
            <h3><Link to={'/dash/users'}>Manage Users</Link></h3>
        </section>
    )

    return (
        <section>
            <p>Welcome {username}</p>
            <h3><Link to={'/dash/notes'}>View My Notes</Link></h3>
            <h3><Link to={'/dash/notes/new'}>Create new Note</Link></h3>
            <h2>Personal Notes: {notes.length}</h2>
            {isAdmin && forAdmin}
        </section>
    )
}
export default Dash