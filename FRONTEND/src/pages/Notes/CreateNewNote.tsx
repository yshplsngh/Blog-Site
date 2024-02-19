import {SubmitHandler, useForm} from "react-hook-form";
import {EditNoteFormSchema, EditNoteFormType} from "../../Types/pages.note.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import useTitle from "../../hooks/useTitle.ts";
import {useCreateNoteMutation} from "../../features/Note/notesApiSlice.ts";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Loading from "../../components/Loading.tsx";
import {errTypo} from "../../Types/feature.auth.ts";

const CreateNewNote = ()=>{

    useTitle('create Note')
    const {
        register,
        handleSubmit,
        formState:{errors,isValid}
    } = useForm<EditNoteFormType>({resolver:zodResolver(EditNoteFormSchema)})

    const [createNote,{
        isLoading,error,isError,isSuccess}
    ] = useCreateNoteMutation();

    const navigate = useNavigate()
    useEffect(() => {
        if(isSuccess){
            navigate('/dash/notes')
        }
    }, [isSuccess,navigate]);

    let errContent=''
    if(isError){
        const err = error as errTypo
        errContent = err?.data?.message
    }
    if(isLoading){
        return <Loading/>
    }
    const onSubmit:SubmitHandler<EditNoteFormType> = async (data:EditNoteFormType)=>{
        if(isValid){
            await createNote({title:data.title,desc:data.desc})
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p className="error-message">{errContent}</p>
                <label htmlFor={'title'}>Title:</label>
                <input
                    type={'text'}
                    id={'title'}
                    {...register('title', {required: true})}
                    placeholder={'Title:'}
                />
                {errors.title && <p>{errors.title?.message}</p>}
                <label htmlFor={'desc'}>Desc:</label>
                <input
                    type={'text'}
                    id={'desc'}
                    {...register('desc', {required: true})}
                    placeholder={'Desc:'}
                />
                {errors.desc && <p>{errors.desc?.message}</p>}
                <button type={'submit'}>Create Note</button>
            </form>
        </div>
    )
}
export default CreateNewNote