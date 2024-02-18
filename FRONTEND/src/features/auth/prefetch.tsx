import {useEffect} from "react";
import {store} from "../../App/store.ts";
import {notesApiSlice} from "../Note/notesApiSlice.ts";
import {Outlet} from "react-router-dom";


const Prefetch = ()=>{

    useEffect(()=>{
        store.dispatch(notesApiSlice.util.prefetch('getNotes','notesList',{force:true}))
    },[])

    return <Outlet/>
}

export default Prefetch