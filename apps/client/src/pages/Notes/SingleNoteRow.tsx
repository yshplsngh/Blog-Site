import {useDeleteNoteMutation} from "../../features/Note/notesApiSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../App/store.ts";
import {resNotesArrayType} from "../../Types/feature.note.ts";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {errTypo} from "../../Types/feature.auth.ts";
import Loading from "../../components/Loading.tsx";
import React, {useEffect} from "react";
import {resetError, setError} from "../../features/auth/authSlice.ts";
import {ownSelector} from "../../features/Note/selector.ts";

interface noteIdType {
    noteId: string | number;
    email:string
}

const SingleNoteRow = React.memo(({noteId,email}: noteIdType) => {
    const {selectNoteById} = ownSelector(email)

    const note = useSelector((state: RootState) => selectNoteById(state, String(noteId))) as resNotesArrayType;
    // console.log(note)
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useDispatch();

    const [deleteNote,
        {isError, error,isSuccess, isLoading}
    ] = useDeleteNoteMutation()

    useEffect(() => {
        if(isSuccess){
            dispatch(resetError())
        }if(isError){
            const err = error as errTypo
            dispatch(setError({errMsg:err?.data?.message}))
        }
        return()=>{
            dispatch(resetError())
        }
    }, [isSuccess,isError]);

    let content;
    if (note as resNotesArrayType) {
        const created: string = new Date(note.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long'});
        const updated: string = new Date(note.updatedAt).toLocaleString('en-US', {day: 'numeric', month: 'long'});

        const handleEdit = () =>{
            navigate(`/dash/notes/edit/${noteId}`,{state:{email:email,prevUrl:location.pathname}})
        }
        const handleView = () => {
            navigate(`/dash/notes/view/${noteId}`,{state:{email:email}});
        }
        const handleDelete = async () => {
            await deleteNote({id: noteId})
        }

        if (isLoading) {
            content= <Loading/>
        }else{
            content=(
                <div className={'single-note'}>
                    <p className={'note__created'}>created:{created}</p>
                    <p className={"note__updated"}>updated:{updated}</p>
                    <p className={"note__title"}>title:{note.title}</p>
                    <p className={"note__username"}>use email:{note.email}</p>
                    <div style={{display: 'flex'}}>
                        <p>
                            <button onClick={handleView}>View note</button>
                        </p>
                        <p>
                            <button onClick={handleEdit}>edit note</button>
                        </p>
                        <p>
                            <button onClick={handleDelete}>Delete note</button>
                        </p>
                    </div>
                </div>
            );
        }
    }
    return content
});


export default SingleNoteRow
