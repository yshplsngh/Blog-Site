import { z } from "zod";
import { isNoteId } from "./noteType.ts";
import { isEmail, isName } from "./authTypes.ts";

const isRoles = z.strictObject({
  roles: z
    .array(z.string())
    .min(1)
    .max(2)
    .refine((data: string[]) => data.includes("people"), {
      message: "array must contain people role",
    }),
});
const isIsActive = z.strictObject({
  isActive: z.boolean(),
});

export const updateInfoType = isRoles
  .merge(isIsActive)
  .merge(isNoteId)
  .merge(isEmail)
  .merge(isName);
