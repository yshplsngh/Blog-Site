import {useLocation, useParams} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store.ts";
import { resNotesArrayType } from "../../Types/feature.note.ts";
import '../../styles/pages/notes/viewnote.css'
import {ownSelector} from "../../features/Note/selector.ts";

const ViewNote = () => {
    const { noteId } = useParams();
    const location = useLocation()

    const {selectNoteById}= ownSelector(location.state.email)

    const note = useSelector((state: RootState) =>
        selectNoteById(state, String(noteId))
    ) as resNotesArrayType;

    if(note as resNotesArrayType){
        const created = new Date(note.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
        });
        const updated = new Date(note.updatedAt).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
        });

        return (
            <div className="view-note-container">
                <div className="note-details">
                    <p className="created-updated">created: {created}</p>
                    <p className="created-updated">updated: {updated}</p>
                </div>
                <div>
                    <p className="title">Title: {note.title}</p>
                    <p className="desc">Desc: {note.desc}</p>
                </div>
            </div>
        );
    }else return <h1>Note not found</h1>
};

export default ViewNote;
