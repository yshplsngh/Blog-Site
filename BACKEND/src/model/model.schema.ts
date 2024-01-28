import mongoose,{Schema} from "mongoose";

interface noteModel{
    user:mongoose.Schema.Types.ObjectId,
    title:string,
    desc:string
}
const noteSchema:Schema = new Schema<noteModel>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    }
},{
    timestamps:true
    }
)

const model = mongoose.model<noteModel>("Note",noteSchema);
export default model;