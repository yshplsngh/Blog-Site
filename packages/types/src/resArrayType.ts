import mongoose from "mongoose";

export interface resType {
  success: boolean;
  message: [];
}
export interface resNotesArrayType {
  createdAt: string;
  desc: string;
  email: string;
  title: string;
  updatedAt: string;
  user: string;
  __v: number;
  _id: string;
  id: string;
}
export interface resUsersArrayType {
  _id: string;
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  notes: mongoose.Types.ObjectId[];
  refreshToken: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type AT = {
  accessToken: string;
};
export type MessageResponse = {
  success: boolean;
  message: AT;
};

export interface errTypo {
  data: {
    message: string;
  };
}
