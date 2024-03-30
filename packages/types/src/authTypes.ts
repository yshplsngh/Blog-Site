import { z } from "zod";
import { isId } from "./noteType.ts";

/* eslint-disable no-unused-vars */
enum errMsg {
  minLength = "name should be min 3 length",
  maxLength = "name should be max 30 length",
  isEmail = "email should be correct type",
  minPass = "password should be min 5 length",
  maxPass = "password should be max 100 length",
}
/* eslint-disable no-unused-vars */

export const isName = z.strictObject({
  name: z.string().min(3, errMsg.minLength).max(30, errMsg.maxLength).trim(),
});
export const isEmail = z.strictObject({
  email: z.string().trim().toLowerCase().email(errMsg.isEmail),
});
export const isPassword = z.strictObject({
  password: z.string().trim().min(5, errMsg.minPass).max(100, errMsg.maxPass),
});

export interface payloadIn {
  name: string;
  email: string;
  roles: string[];
}

export const LoginFormSchema = isEmail.merge(isPassword);
export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const SignupFormSchema = LoginFormSchema.merge(isName);
export type signupFormType = z.infer<typeof SignupFormSchema>;

export interface loginType {
  email: string;
  password: string;
}

export const updateProfileType = isName.merge(isId);
const isOldPassword = z.strictObject({
  oldPassword: z.string().trim(),
});
export const changePasswordType = isPassword.merge(isOldPassword).merge(isId);
// const loginFormData = isEmail.merge(isPassword);
// const signupFormData = loginFormData.merge(isName);

// export { loginFormData, signupFormData };
