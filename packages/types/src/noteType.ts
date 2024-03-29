import { z } from "zod";
import mongoose from "mongoose";

enum noteMsg {
  minLength = " can't be empty",
  maxTLength = "title can't be more than 20 character, pay 2000💸💵 for 1 million character upi id: 8439345464@ybl",
  maxDLength = "description can't be more than 100 character, pay 2000💸💵 for 1 million character upi id: 8439345464@ybl",
}

export const isNoteId = z.strictObject({
  noteId: z
    .string()
    .trim()
    .refine((data: string): boolean => {
      return mongoose.Types.ObjectId.isValid(data);
    }),
});

// const isId = z.strictObject({
//   id: z
//     .string()
//     .trim()
//     .refine((data: string): boolean => {
//       return mongoose.Types.ObjectId.isValid(data);
//     }),
// });
export const EOCNoteFormSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, noteMsg.minLength)
    .max(20, noteMsg.maxTLength),
  desc: z
    .string()
    .trim()
    .min(1, noteMsg.minLength)
    .max(100, noteMsg.maxDLength),
});
export const EOCNoteFormSchemaWithId = EOCNoteFormSchema.merge(isNoteId);

export type EOCNoteFormType = z.infer<typeof EOCNoteFormSchema>;

export interface noteInputType {
  title: string;
  desc: string;
}

export interface noteInputTypeWithId extends noteInputType {
  id: string;
}

// const createNoteForm = z.strictObject({
//   title: z
//       .string()
//       .trim()
//       .min(1, noteMsg.minLength)
//       .max(20, noteMsg.maxTLength),
//   desc: z
//       .string()
//       .trim()
//       .min(1, noteMsg.minLength)
//       .max(100, noteMsg.maxDLength),
// });

// export { createNoteForm, createNoteFormWithId, isId };
