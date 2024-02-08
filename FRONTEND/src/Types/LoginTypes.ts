import {z} from "zod";
import {isEmail,isPassword} from "./commonType.ts";

export const  LoginFormSchema= isEmail.merge(isPassword)
export type LoginFormType = z.infer<typeof LoginFormSchema>