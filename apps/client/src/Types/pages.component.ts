import {z} from "zod";

export enum errMsg{
    minLength="name should be min 3 length",
    maxLength="name should be max 30 length",
    isEmail="email should be correct type",
    minPass="password should be min 5 length",
    maxPass="password should be max 100 length"
}

const isName = z.strictObject({
    name:z.string()
        .min(3,errMsg.minLength)
        .max(30,errMsg.maxLength)
        .trim(),
})
const isEmail = z.strictObject({
    email:z.string()
        .trim()
        .toLowerCase()
        .email(errMsg.isEmail)
})
const isPassword = z.strictObject({
    password:z.string()
        .trim()
        .min(5,errMsg.minPass)
        .max(100,errMsg.maxPass)
})

export const  LoginFormSchema= isEmail.merge(isPassword)
export type LoginFormType = z.infer<typeof LoginFormSchema>

export const SignupFormSchema = isName.merge(isEmail).merge(isPassword)
export type  signupFormType = z.infer<typeof SignupFormSchema>