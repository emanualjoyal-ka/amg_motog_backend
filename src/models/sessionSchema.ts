import mongoose from "mongoose";

export interface Session extends Document {
    userId: mongoose.Types.ObjectId;
    tokenId: string;
    refreshToken: string;
    ipaddress?: string;
    userAgent?: string;
    valid: boolean;
    loginAt: Date;
    lastUsedAt: Date;
    logoutAt:Date;
}

const SessionSchema=new mongoose.Schema<Session>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admins",
        required:true
    },
    tokenId:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    },
    ipaddress:{
        type:String
    },
    userAgent:{
        type:String
    },
    valid:{
        type:Boolean,
        default:true
    },
    lastUsedAt:{
        type:Date,
        default:Date.now
    },
     loginAt:{
        type:Date,
        default:Date.now
    },
    logoutAt:
    { 
        type: Date 
    } 
})

export default mongoose.model<Session>("Sessions",SessionSchema);