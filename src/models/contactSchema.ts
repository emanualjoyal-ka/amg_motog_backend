import mongoose, { Document } from "mongoose";

export interface Contact extends Document{
    name:string;
    email:string;
    subject:string;
    message:string;
}

const contactSchema=new mongoose.Schema<Contact>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    subject:{
        type:String,
        required:true,
        trim:true
    },
    message:{
        type:String,
        required:true,
        trim:true
    }
},
{
    timestamps:true
}
)


export default mongoose.model<Contact>("Contacts",contactSchema);