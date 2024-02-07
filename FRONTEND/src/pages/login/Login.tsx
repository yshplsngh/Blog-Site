import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "./LoginTypes.ts";
import type { LoginFormType } from "./LoginTypes.ts";
import { useLoginMutation } from "../../features/auth/authApiSlice.ts";
import { useEffect, useState } from "react";
import Loading from "../../components/loading/Loading.tsx";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { errTypo, MessageResponse } from "../../features/auth/authType.ts";
import { useDispatch } from "react-redux";
import { setCredential } from "../../features/auth/authSlice.ts";
import "./login.css"

const Login = () => {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormType>({ resolver: zodResolver(LoginFormSchema) });

    const [login, { isError, isLoading, isSuccess }] = useLoginMutation();
    const [errMsg, setErrMsg] = useState<string>("");
    const navigate: NavigateFunction = useNavigate();

    const onSubmit: SubmitHandler<LoginFormType> = async (data:LoginFormType) => {
        if (isValid) {
            try {
                const res:MessageResponse = await login(data).unwrap() as MessageResponse;
                console.log(res);
                dispatch(setCredential(res.message));
            } catch (err) {
                const er: errTypo = err as errTypo;
                setErrMsg(er.data.message);
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
        return <Loading />;
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
            </form>
        </div>
    );
};
export default Login;
