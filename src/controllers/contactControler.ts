import { Request, Response } from "express";
import contactSchema from "../models/contactSchema.js";
import { contactValidation } from "../validations/contactValidation.js";



export const createContact=async (req:Request,res:Response)=>{
    try {

        const {error}=contactValidation.validate(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message})
        }

        const {name,email,subject,message}=req.body;

        if(!name || !email || !subject || !message){
            return res.status(400).json({success:false,error:"All fields are required"})
        }

        const contact=await contactSchema.create({
            name:name,
            email:email,
            subject:subject,
            message:message
        });

        res.status(201).json({success:true,data:contact});

    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"});
    }
}


export const getAllContacts=async (req:Request,res:Response)=>{
    try {
        const contacts=await contactSchema.find({});
        if(!contacts){
            return res.status(404).json({success:false,error:"No contacts found"})
        }
        res.status(200).json({success:true,data:contacts})
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}


export const getContact=async (req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const contact=await contactSchema.findById(id);
        if(!contact){
            return res.status(404).json({success:false,error:"Contact not found"})
        }
        res.status(200).json({success:true,data:contact});
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERORR"})
    }
}

export const deleteContact=async (req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const contact=await contactSchema.findByIdAndDelete(id);
        if(!contact){
            return res.status(404).json({success:false,error:"Contact not found"})
        } 
        res.status(200).json({success:true,message:"Contact deleted successfully"})
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}