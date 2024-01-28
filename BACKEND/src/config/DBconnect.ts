import mongoose from "mongoose";
import {config} from "./config";

const dbConnect = async ():Promise<void> => {
    try {
        await mongoose.connect("mongodb://localhost:27017/todo");
        // await mongoose.connect(config.MONGO_URI);
    } catch (err) {
        console.error("Error in mongodb initial connection");
    }
};
export { dbConnect };

