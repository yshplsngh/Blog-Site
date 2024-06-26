import useTitle from "../../hooks/useTitle.ts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store.ts";
import { useUpdateNoteMutation } from "../../features/Note/notesApiSlice.ts";
import {
  resNotesArrayType,
  errTypo,
  EOCNoteFormType,
  EOCNoteFormSchema,
  isId,
} from "@repo/types";
import Loading from "../../components/Loading.tsx";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import "../../styles/pages/notes/editnote.css";
import { ownSelector } from "../../features/Note/selector.ts";

const EditNote = () => {
  useTitle("Edit Note");
  const navigate = useNavigate();
  const { noteId } = useParams();
  const location = useLocation();

  const { selectNoteById } = ownSelector(location.state.email);
  const isIdValid = isId.safeParse({ noteId });
  let errContent: string = "";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<EOCNoteFormType>({ resolver: zodResolver(EOCNoteFormSchema) });

  const note = useSelector((state: RootState) =>
    selectNoteById(state, String(noteId)),
  ) as resNotesArrayType;

  const [updateNote, { isLoading, isError, error, isSuccess }] =
    useUpdateNoteMutation();
  // const [errMsg, setErrMsg] = useState<string>('')

  const onSubmit: SubmitHandler<EOCNoteFormType> = async (
    data: EOCNoteFormType,
  ) => {
    if (isValid && isIdValid.success) {
      await updateNote({ id: noteId, title: data.title, desc: data.desc });
    }
  };

  useEffect(() => {
    if (note) {
      setValue("title", note.title);
      setValue("desc", note.desc);
    }
  }, [note, setValue]);

  useEffect(() => {
    if (isSuccess) {
      navigate(location.state?.prevUrl);
    }
  }, [isSuccess, navigate]);

  if (isError) {
    const err = error as errTypo;
    errContent = err.data.message;
  }

  let content;

  if (note as resNotesArrayType) {
    content = (
      <div className="edit-note-container">
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <p className="error-message">{errContent}</p>
          <label htmlFor={"title"}>Title:</label>
          <input
            type={"text"}
            id={"title"}
            {...register("title", { required: true })}
            placeholder={"title-"}
          />
          {errors.title && (
            <p className="error-message">{errors.title?.message}</p>
          )}
          <label htmlFor={"desc"}>Desc:</label>
          <input
            type={"textarea"}
            id={"desc"}
            {...register("desc", { required: true })}
            placeholder={"desc-"}
          />
          {errors.desc && (
            <p className="error-message">{errors.desc?.message}</p>
          )}
          <button type={"submit"}>Done</button>
        </form>
      </div>
    );
  } else if (!isIdValid.success) {
    content = <p>Invalid note in URL</p>;
  } else if (isLoading || (isIdValid.success && !note)) {
    content = <Loading />;
  } else {
    content = <h1>Notes found | something went wrong</h1>;
  }

  return content;
};

export default EditNote;
