import express, { Application, Response, Request } from "express";
import mongoose from "mongoose";
import process from "process";
import cors from "cors";
import "express-async-errors";
import { requestLogger, infoLogger, errorLogger } from "./middleware/logger";
import { dbConnect } from "./config/DBconnect";
import { authRouter } from "./routes/auth.routes";
import { noteRouter } from "./routes/note.routes";
import { adminRouter } from "./routes/admin.routes";
import { corsOptions } from "./config/corsOptions";
import { credentials } from "./config/credentials";
import { validateEnv } from "./config/config";
import { msg } from "./types/globalTypes";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes";

const app: Application = express();
app.disable("x-powered-by");
validateEnv();
dbConnect();

app.use(requestLogger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
/*for rich html form data*/
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/note", noteRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

app.use(errorLogger);
mongoose.connection.on("open", (): void => {
  infoLogger(msg.MCO);
  console.log(msg.MCO);
});
/** after getting open event it executes callback */
mongoose.connection.once("open", (): void => {
  app.listen(3500, (): void => {
    console.log(msg.LAP3500);
  });
});
// mongoose.connection.on('connected',():void=> {
//     console.log(msg.MCTD);
// });
mongoose.connection.on("error", (err): void => {
  infoLogger(msg.MCE + err);
  console.log(msg.MCE + err);
});
mongoose.connection.on("disconnected", (): void => {
  infoLogger(msg.MD);
  console.log(msg.MD);
});
process.on("SIGINT", (): void => {
  mongoose.connection.close().then((): void => {
    console.log(msg.MDTctrl_c);
    process.exit(0);
  });
});
