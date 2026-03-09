import { Request, Response } from "express";
import requestSchema from "../models/requestSchema.js";
import sendNotification from "../middleware/nodemailerConfig/requestNotify.js";
import cloudinary from "../middleware/cloudinaryConfig/cloudinaryConfig.js";


export const CreateRequest=async (req:Request,res:Response)=>{
    try {
        const {fullName,phone,bikeBrand,bikeModel,year,partName,condition,address,description}=req.body;
        
        const imageUrl=req.file?.path;
        const imageId=req.file?.filename;
        
        if(!imageUrl || !fullName || !phone || !bikeBrand || !bikeModel || !year || !partName || !condition || !address || !description){
            return res.status(400).json({success:false,error:"All fields are reuired"});
        }
        
        const request=await requestSchema.create({
            fullName:fullName,
            phone:phone,
            bikeBrand:bikeBrand,
            bikeModel:bikeModel,
            year:year,
            partName:partName,
            condition:condition,
            address:address,
            description:description,
            image:imageUrl,
            imageId:imageId
        })

        sendNotification(request);

        res.status(201).json({success:true,data:request});    
        
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}


export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await requestSchema.find({});
    if(!requests){
        return res.status(404).json({success:false,error:"No Requests found"})
    }
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: "SERVER ERROR" });
  }
};


export const getRequest=async (req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const request=await requestSchema.findById(id);
        if(!request){
            res.status(404).json({success:false,error:"Request not found"});
        }
        res.status(200).json({success:true,data:request})
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"});
    }
}


export const deleteRequest=async (req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const request=await requestSchema.findByIdAndDelete(id);
        if(!request){
            return res.status(404).json({success:false,error:"Request not found"})
        }
        if(request.imageId){
            await cloudinary.uploader.destroy(request.imageId);
        }
        return res.status(200).json({ success: true, message: "Request deleted successfully" });
    } catch (error) {
    res.status(500).json({ success: false, error: "SERVER ERROR" });
    }
}