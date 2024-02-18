import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { signupFormType, SignupFormSchema } from "../Types/pages.component.ts";
import { useSignupMutation } from "../features/auth/authApiSlice.ts";
import { errTypo } from "../Types/feature.auth.ts";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.tsx";

import "../styles/pages/signup.css";
import useTitle from "../hooks/useTitle.ts";

const Signup = () => {
    useTitle("Sign up")
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<signupFormType>({ resolver: zodResolver(SignupFormSchema) });

    const [signup, { isError, isLoading, isSuccess }] = useSignupMutation();
    const [errMsg, setErrMsg] = useState<string>("");

    const onSubmit: SubmitHandler<signupFormType> = async (data: signupFormType) => {
        if (isValid) {
            try {
                const res = await signup(data).unwrap();
                console.log(res);
            } catch (err) {
                const er: errTypo = err as errTypo;
                setErrMsg(er?.data?.message);
            }
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setErrMsg("");
            navigate("/login");
            console.log("redirect to register page");
        }
    }, [isSuccess, navigate]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                {isError && <p className="error-message">{errMsg}</p>}
                <label htmlFor="name">Name:</label>
                <input
                    {...register("name")}
                    className="signup-input"
                    placeholder="John dev"
                    type="text"
                    id="name"
                />
                {errors.name && <p className="error-message">{errors.name?.message}</p>}
                <label htmlFor="email">Email:</label>
                <input
                    {...register("email")}
                    className="signup-input"
                    placeholder="xyz@gmail.com"
                    type="email"
                    id="email"
                />
                {errors.email && <p className="error-message">{errors.email?.message}</p>}
                <label htmlFor="password">Password:</label>
                <input
                    {...register("password")}
                    className="signup-input"
                    type="password"
                    id="password"
                />
                {errors.password && <p className="error-message">{errors.password?.message}</p>}
                <button type="submit" className="signup-button">
                    Signup
                </button>
            </form>
        </div>
    );
};

export default Signup;
