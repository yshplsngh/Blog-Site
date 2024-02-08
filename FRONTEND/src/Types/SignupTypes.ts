import {z} from 'zod'
import {isName,isEmail,isPassword} from "./commonType.ts";

export const SignupFormSchema = isName.merge(isEmail).merge(isPassword)
export type  signupFormType = z.infer<typeof SignupFormSchema>