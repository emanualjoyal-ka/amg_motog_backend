import mongoose from "mongoose";


export interface Request extends mongoose.Document{
    fullName:string;
    phone:string;
    bikeBrand:string;
    bikeModel:string;
    year:string;
    partName:string;
    condition:string;
    image:string;
    imageId:string;
    address:string;
    description:string;
}


const RequestSchema=new mongoose.Schema<Request>({
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        trim:true
    },
    bikeBrand:{
        type:String,
        required:true,
        trim:true
    },
    bikeModel:{
        type:String,
        required:true,
        trim:true
    },
    year:{
        type:String
    },
    partName:{
        type:String,
        required:true,
        trim:true
    },
    condition:{
        type:String,
        required:true,
        enum:["OEM ( Original )","Used","Any available"],
        default:"Any available"
    },
    image:{
        type:String,
    },
    imageId:{
        type:String
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    }
},
{
    timestamps:true
}
)

export default mongoose.model<Request>("Requests",RequestSchema);