import * as fs from "fs";
import * as path from "path";
import * as fsPromises from "fs/promises";
import { NextFunction, Request, Response } from "express";
import { format } from "date-fns";
import { UserResponse } from "../types/globalTypes";

const mainLogger = async (message: string, filename: string): Promise<void> => {
  const date: string = format(new Date(), "HH:mm:ss MM/dd/yyyy");
  const dataToLog: string = `${date}\t\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "../logs"))) {
      fs.mkdirSync(path.join(__dirname, "../logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "../logs", filename),
      dataToLog,
    );
  } catch (err) {
    console.log(err);
  }
};
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const message: string = `method:${req.method}\turl:${req.url}\torigin:${req.headers.origin}`;
  mainLogger(message, "requestLog.log");
  next();
};
export const infoLogger = (data: string): void => {
  mainLogger(data, "serverLog.log");
};
export const errorLogger = (
  err: any,
  req: Request,
  res: Response<UserResponse>,
  next: NextFunction,
): void => {
  if (err instanceof SyntaxError && "body" in err) {
    const msg: string = err.message.replace(/\r?\n|\r/g, "");
    mainLogger(
      `${err.name}: ${msg}\t${req.method}\t${"url"}:${req.url}\t${"origin"}:${req.headers.origin}`,
      "errLog.log",
    );
    res.status(400).json({
      success: true,
      message:
        "Invalid JSON format. Please ensure your input is a valid JSON object.",
    });
  }
  next();
};
export const authLogger = (name: string, email: string, msg: string): void => {
  const message: string = `name:${name}\temail:${email}\t msg:${msg}`;
  mainLogger(message, "authLog.log");
};
export const msgLogger = (data: string): void => {
  mainLogger(data, "jwtLog.log");
};

export const adminLogger = (email: string | undefined, msg: string): void => {
  const message: string = `email:${email}\t msg:${msg}`;
  mainLogger(message, "adminLog.log");
};
export const userLogger = (email: string | undefined, msg: string): void => {
  const message: string = `email:${email}\t msg:${msg}`;
  mainLogger(message, "userLog.log");
};
