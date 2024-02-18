import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginFormSchema,LoginFormType} from "../Types/pages.component.ts";
import {useLoginMutation} from "../features/auth/authApiSlice.ts";
import {useEffect, useState} from "react";
import Loading from "../components/Loading.tsx";
import {Link, NavigateFunction, useNavigate} from "react-router-dom";
import {errTypo, MessageResponse} from "../Types/feature.auth.ts";
import {useDispatch} from "react-redux";
import {setCredential} from "../features/auth/authSlice.ts";
import "../styles/pages/login.css"
import useTitle from "../hooks/useTitle.ts";

const Login = () => {
    useTitle("Login")
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm<LoginFormType>({resolver: zodResolver(LoginFormSchema)});


    const [login, {isError, isLoading, isSuccess}] = useLoginMutation();
    const [errMsg, setErrMsg] = useState<string>("");
    const navigate: NavigateFunction = useNavigate();

    const onSubmit: SubmitHandler<LoginFormType> = async (data: LoginFormType) => {
        if (isValid) {
            try {
                const res: MessageResponse = await login(data).unwrap() as MessageResponse;
                console.log(res);
                dispatch(setCredential(res.message));

            } catch (err) {
                const er: errTypo = err as errTypo;
                console.log(err)
                console.log(er)
                setErrMsg(er?.data?.message);
            }
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setErrMsg("");
            navigate('/')
            console.log("redirect to home page");
        }
    }, [isSuccess, navigate]);

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div className="login-container"> {/* Added a container */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                {isError && <p className="error-message">{errMsg}</p>}
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="xyz@gmail.com"
                />
                {errors.email && (
                    <p className="error-message">{errors.email?.message}</p>
                )}

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    {...register("password")}
                    placeholder="password"
                />
                {errors.password && (
                    <p className="error-message">{errors.password?.message}</p>
                )}

                <button type="submit">Login</button>
                <Link to={'/signup'} className={'signup'}>Sign up</Link>
            </form>

        </div>
    );
};
export default Login;
