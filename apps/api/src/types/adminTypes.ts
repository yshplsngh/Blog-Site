// import { z } from "zod";
// import { isId } from "./noteTypes";
// import { isEmail, isName } from "./authTypes";
//
// const isRoles = z.strictObject({
//   roles: z
//     .array(z.string())
//     .min(1)
//     .max(2)
//     .refine((data: string[]) => data.includes("people"), {
//       message: "array must contain people role",
//     }),
// });
// const isIsActive = z.strictObject({
//   isActive: z.boolean(),
// });
//
// export const updateInfoType = isRoles
//   .merge(isIsActive)
//   .merge(isId)
//   .merge(isEmail)
//   .merge(isName);
