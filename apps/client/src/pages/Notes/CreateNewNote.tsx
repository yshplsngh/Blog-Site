import { SubmitHandler, useForm } from "react-hook-form";
import { errTypo, EOCNoteFormType, EOCNoteFormSchema } from "@repo/types";
import { zodResolver } from "@hookform/resolvers/zod";
import useTitle from "../../hooks/useTitle.ts";
import { useCreateNoteMutation } from "../../features/Note/notesApiSlice.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading.tsx";

const CreateNewNote = () => {
  useTitle("create Note");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EOCNoteFormType>({ resolver: zodResolver(EOCNoteFormSchema) });

  const [createNote, { isLoading, error, isError, isSuccess }] =
    useCreateNoteMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  let errContent = "";
  if (isError) {
    const err = error as errTypo;
    errContent = err?.data?.message;
  }
  let content;
  const onSubmit: SubmitHandler<EOCNoteFormType> = async (
    data: EOCNoteFormType,
  ) => {
    if (isValid) {
      await createNote({ title: data.title, desc: data.desc });
    }
  };

  if (isLoading) {
    content = <Loading />;
  } else {
    content = (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="error-message">{errContent}</p>
          <label htmlFor={"title"}>Title:</label>
          <input
            type={"text"}
            id={"title"}
            {...register("title", { required: true })}
            placeholder={"Title:"}
          />
          {errors.title && <p>{errors.title?.message}</p>}
          <label htmlFor={"desc"}>Desc:</label>
          <input
            type={"text"}
            id={"desc"}
            {...register("desc", { required: true })}
            placeholder={"Desc:"}
          />
          {errors.desc && <p>{errors.desc?.message}</p>}
          <button type={"submit"}>Create Note</button>
        </form>
      </div>
    );
  }
  return content;
};
export default CreateNewNote;
