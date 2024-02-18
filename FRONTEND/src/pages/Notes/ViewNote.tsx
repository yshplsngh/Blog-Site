import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store.ts";
import { selectNoteById } from "../../features/Note/notesApiSlice.ts";
import { resNotesArrayType } from "../../Types/feature.note.ts";
import '../../styles/pages/notes/viewnote.css'
const ViewNote = () => {
    const { noteId } = useParams();
    const note = useSelector((state: RootState) =>
        selectNoteById(state, String(noteId))
    ) as resNotesArrayType;

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
};

export default ViewNote;
