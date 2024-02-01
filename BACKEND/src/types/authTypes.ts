import {z, ZodType} from "zod";

enum errMsg{
    minLength="should be min 3 length",
    maxLength="should be max 30 length",
    isEmail="should be correct type",
    minPass="should be min 5 length",
    maxPass="should be max 100 length"
}


/* for login */
export interface loginType{
    email:string,
    password:string
}

const loginFormData:ZodType<loginType> = z.strictObject({
    email:z.string()
        .min(3,errMsg.minLength)
        .max(30,errMsg.maxLength)
        .trim()
        .toLowerCase()
        .email(errMsg.isEmail),
    password:z.string()
        .trim()
        .min(5,errMsg.minPass)
        .max(100,errMsg.maxPass),
})


/* for register */
interface registerType{
    name:string
    email:string
    password:string
}
const registerFormData:ZodType<registerType> = z.strictObject({
    name:z.string()
        .min(3,errMsg.minLength)
        .max(30,errMsg.maxLength)
        .trim(),
    email:z.string()
        .min(3,errMsg.minLength)
        .max(30,errMsg.maxLength)
        .trim()
        .toLowerCase()
        .email(errMsg.isEmail),
    password:z.string()
        .trim()
        .min(5,errMsg.minPass)
        .max(100,errMsg.maxPass)
})

interface payloadIn{
    name:string,
    email:string,
    roles:string[]
}

export {loginFormData,registerFormData,payloadIn};