import mongoose, { Document } from "mongoose";

export interface Admins extends Document{
    userName:string;
    email:string;
    password:string;
    role:string;
}

const adminSchema=new mongoose.Schema<Admins>({
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
     role:{ 
        type: String,
        enum: ["superadmin", "admin"],
        default: "admin"
    }
},
{
    timestamps:true
})

export default mongoose.model<Admins>("Admins",adminSchema);