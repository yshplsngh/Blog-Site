// import {useGetUserNotesByEmailMutation, useGetUserNotesByEmailQuery} from "../../features/admin/adminApiSlice.ts";
// import SingleNoteRow from "../Notes/SingleNoteRow.tsx";
// import '../../styles/pages/notes/note.css'
// import {useParams} from "react-router-dom";
// import {useSelector} from "react-redux";
// import {RootState} from "../../App/store.ts";
// import {resUsersArrayType} from "../../Types/feature.admin.ts";
// import {selectAllNotes} from "../../features/Note/notesApiSlice.ts";

const ViewUserAllNotes = ()=>{
    // const {userId} = useParams()

    // const user = useSelector((state:RootState)=>
    //     selectUserById(state,String(userId))
    // ) as resUsersArrayType

    // const checkuser = useSelector((state:RootState)=>
    //     selectAllNotes(state)
    // )
    // console.log(checkuser)
    // const {
    //     data:usersNote,
    //     isSuccess,
    //     isError,
    //     error
    // } = useGetUserNotesByEmailQuery({
    //     pollingInterval:15000,
    //     refetchOnFocus:true,
    //     refetchOnMountOrArgChange:true,
    // });


    // console.log(usersNote)
    // let content
    // if(isError){
    //     console.log(error);
    // }
    // if(isSuccess){
    //     console.log('done');
    //     console.log(usersNote)
    // }
    // if(isSuccess){
    //     const {ids} = usersNote
    //
    //     typecast to array || no need
        // const filteredIds = [...ids]
        // const tableContent = ids?.length && filteredIds.map((userId)=> <SingleNoteRow key={userId} userId={userId}/>)
        // const tableContent = ids?.length && filteredIds.map((userId)=> <SingleNoteRow key={userId} noteId={userId}/>)
        // if(ids.length===0){
        //     content = <p>No Users Notes</p>
        // }else{
        //     content = (
        //         <div className={'note-list'}>
        //             {/*<p className="error-message">{msg}</p>*/}
        //             {tableContent}
        //         </div>
        //     )
        // }
    // }
    // return content
    return <h1>coming Soon</h1>
}
export default ViewUserAllNotes