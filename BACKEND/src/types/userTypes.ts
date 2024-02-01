import {isName, isPassword} from "./authTypes";
import {isId} from "./noteTypes";
import {z} from 'zod'
export const updateProfileType = isName.merge(isId);
const isOldPassword = z.strictObject({
    oldPassword:z.string().trim()
})
export const changePasswordType = isPassword.merge(isOldPassword).merge(isId);