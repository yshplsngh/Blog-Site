import mongoose from "mongoose";

const dbConnect = async ():Promise<void> => {
    try {
        await mongoose.connect("mongodb://localhost:27017/todo");
        // await mongoose.connect("mongodb+srv://yashpal9rx:D560075WIN9SATLAS@mernapp.hvyowyg.mongodb.net/TODO?retryWrites=true&w=majority");
    } catch (err) {
        console.error("Error in mongodb initial connection");
    }
};
export { dbConnect };

