// import {useEffect} from "react";
// import {store} from "../../App/store.ts";
// import {notesApiSlice} from "../Note/notesApiSlice.ts";
import {Outlet} from "react-router-dom";
// import {adminApiSlice} from "../admin/adminApiSlice.ts";
// import useAuth from "../../hooks/useAuth.ts";


const Prefetch = ()=>{
    // const {isAdmin,useAuthEmail} = useAuth()
    // useEffect(()=>{
    //     store.dispatch(notesApiSlice.util.prefetch('getNotes',{email:useAuthEmail},{force:true}))
    //     if(isAdmin){
    //         store.dispatch(adminApiSlice.util.prefetch('getUsers','usersList',{force:true}))
    //     }
    //
    // },[])

    return <Outlet/>
}

export default Prefetch