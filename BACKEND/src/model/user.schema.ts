import mongoose,{Schema} from "mongoose";

export interface userModel{
    name:string
    email:string
    password:string
    roles:string[]
    isActive:boolean
    notes:mongoose.Types.ObjectId[]
    refreshToken:String[]
}

const userScheme:Schema = new Schema<userModel>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    roles:{
        type:[String],
        required:true
    },
    isActive:{
        type:Boolean,
        required:true,
    },
    notes:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }],
    refreshToken:[String]
},
    {
        timestamps:true
    }
)
const model = mongoose.model<userModel>("User",userScheme);
export default model;