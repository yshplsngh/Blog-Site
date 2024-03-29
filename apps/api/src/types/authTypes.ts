import { z } from "zod";

enum errMsg {
  minLength = "should be min 3 length",
  maxLength = "should be max 30 length",
  isEmail = "should be correct type",
  minPass = "should be min 5 length",
  maxPass = "should be max 100 length",
}

/* for login */
export interface loginType {
  email: string;
  password: string;
}

export const isEmail = z.strictObject({
  email: z.string().trim().toLowerCase().email(errMsg.isEmail),
});

export const isPassword = z.strictObject({
  password: z.string().trim().min(5, errMsg.minPass).max(100, errMsg.maxPass),
});
const loginFormData = isEmail.merge(isPassword);

export const isName = z.strictObject({
  name: z.string().min(3, errMsg.minLength).max(30, errMsg.maxLength).trim(),
});
const signupFormData = loginFormData.merge(isName);

export interface payloadIn {
  name: string;
  email: string;
  roles: string[];
}

export { loginFormData, signupFormData };
