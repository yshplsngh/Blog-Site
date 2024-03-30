/* eslint-disable no-unused-vars */
export enum msg {
  // eslint-disable-next-line no-unused-vars
  MCO = "Mongoose connection opened",
  LAP3500 = "listening at port 3500",
  // MCTD = "Mongoose connected to database",
  MCE = "Mongoose connection error ",
  MD = "Mongoose Disconnected",
  MDTctrl_c = "Mongoose disconnect through ctrl + c",
}
/* eslint-disable no-unused-vars */

export interface UserResponse {
  success: boolean;
  message: string | object;
}
export interface dataToInsert {
  email?: string;
  roles?: string[];
}
