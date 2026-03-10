import dotenv from "dotenv"
import { Request, Response } from "express"
import { LoginValidation, RegisterValdidation } from "../validations/adminValidation.js"
import adminSchema from "../models/adminSchema.js";
import bcrypt from "bcrypt";
import sessionSchema from "../models/sessionSchema.js";
import {v4 as uuidv4} from "uuid"
import jwt, { Secret, SignOptions } from "jsonwebtoken"

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET!;
const REFRESH_TOKEN: Secret = process.env.REFRESH_TOKEN!;


export const createAdmin=async (req:Request,res:Response)=>{
    try {
        const {error}=RegisterValdidation.validate(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message})
        }
        const {userName,email,password, role}=req.body;

        
            if(!req.user || req.user.role !== "superadmin"){
                return res.status(403).json({success:false,error:"Only superadmins can create admins"})
            }
        

        const adminExist=await adminSchema.findOne({email});

        if(adminExist){
            return res.status(404).json({success:false,error:"Admin already exist!"})
        }

        const hashedPasswd=await bcrypt.hash(password,10);
        const data=await adminSchema.create({
            userName:userName,
            email:email,
            password:hashedPasswd,
            role:role || "admin"
        })

        res.status(201).json({success:true,data:data});
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}


export const LoginAdmin=async (req:Request,res:Response)=>{
    try {
        const {error}=LoginValidation.validate(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message})
        }
        const {email,password}=req.body;

        const adminExist=await adminSchema.findOne({email});
        if(!adminExist){
            return res.status(404).json({success:false,error:"Admin don't exist"})
        }

        const passwdMatch=await bcrypt.compare(password,adminExist.password);
        if(!passwdMatch){
            return res.status(404).json({success:false,error:"Invalid password"})
        }

        await sessionSchema.updateMany({userId:adminExist._id},{valid:false})

        const tokenId=uuidv4();

        await sessionSchema.create({
            userId:adminExist._id,
            tokenId:tokenId,
            refreshToken:"",
            ipaddress:req.ip,
            userAgent:req.headers["user-agent"],
            valid:true,
            loginAt:new Date(),
            lastUsedAt:new Date()
        })

        const accessTokenOptions: SignOptions = {
            expiresIn: (process.env.ACCESS_TOKEN_EXPIRE || "5m") as SignOptions["expiresIn"]
        }

        const refreshTokenOptions: SignOptions = {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRE || "7d") as SignOptions["expiresIn"]
        }

        const accesstoken = jwt.sign(
            {id:adminExist._id.toString(), email:adminExist.email, user:adminExist.userName, role: adminExist.role, jti:tokenId},
            JWT_SECRET,
            accessTokenOptions
        )

        const refreshtoken = jwt.sign(
            {id:adminExist._id.toString(), email:adminExist.email,role: adminExist.role},
            REFRESH_TOKEN,
            refreshTokenOptions
        )

        await sessionSchema.updateOne(
            {userId:adminExist._id,tokenId:tokenId},
            {refreshToken:refreshtoken}
        )

        res.cookie("accessToken",accesstoken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 5 * 60 * 1000,
        })
        res.cookie("refreshToken",refreshtoken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7*24*60*60*1000,
        })

        res.json({success:true,email:adminExist.email,userName:adminExist.userName,accessToken:accesstoken,message:"Logged in Successfully"})

    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}


export const LogoutAdmin=async (req:Request,res:Response)=>{
    try {
        const refreshtoken=req.cookies.refreshToken;

        if(refreshtoken){
            const session=await sessionSchema.findOne({
                refreshToken:refreshtoken,
                valid:true
            })

            if(session){
                session.valid=false;
                session.refreshToken="";
                session.logoutAt=new Date();
                await session.save();
            }
        }

        res.clearCookie("accessToken",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        res.json({success:true,message:"Logged out successfully"})
    } catch (error) {
        res.status(500).json({success:false,error:error instanceof Error ? error.message : "SERVER ERROR"})
    }
}


export const refreshToken=async (req:Request,res:Response)=>{
    try {
        const refreshtoken = req.cookies.refreshToken;  // fixed: was destructuring as {refreshtoken}
        if(!refreshtoken){
            return res.status(401).json({success:false,message:"Refresh token not found"})
        }

        const session=await sessionSchema.findOne({
            refreshToken:refreshtoken,
            valid:true
        })

        if(!session){
            return res.status(403).json({success:false,message:"Expired session, Login again"})
        }

        jwt.verify(refreshtoken, REFRESH_TOKEN, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
            if(err){
                return res.status(403).json({success:false,message:"Expired refresh token"})
            }
            const payload = decoded as jwt.JwtPayload

            const accessTokenOptions: SignOptions = {
                expiresIn: (process.env.ACCESS_TOKEN_EXPIRE || "5m") as SignOptions["expiresIn"]
            }

            const newAccessToken = jwt.sign(
                {id:payload.id, email:payload.email, jti:session.tokenId},
                JWT_SECRET,
                accessTokenOptions
            )

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 5 * 60 * 1000,
            });
  
            res.json({ success: true, accessToken: newAccessToken });
        })
    } catch (error) {
        res.status(500).json({success:false,error:error instanceof Error ? error.message : "SERVER ERROR"})
    }
}


export const getAllAdmins=async (req:Request,res:Response)=>{
    try {
        const admins=await adminSchema.find().select("-password")
        if(!admins || admins.length === 0){
            return res.status(404).json({success:false,error:"No admins found"})
        }
        res.status(200).json({success:true,data:admins})
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}


export const deleteAnAdmin=async (req:Request,res:Response)=>{
    try {
        const {id}=req.params;

        const admin=await adminSchema.findById(id);
        if(!admin){
            return res.status(404).json({success:false,error:"Admin not found"})
        }
        await adminSchema.findByIdAndDelete(id);
        await sessionSchema.deleteMany({userId:id})
        res.json({ success: true, message: "Admin deleted successfully" })
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}


export const getloginLogs=async(req:Request,res:Response)=>{
    try {
        if(!req.user || req.user.role !== "superadmin"){
            return res.status(403).json({success:false,error:"Only super admins can view logs"})
        }
        const logs=await sessionSchema.find().populate("userId","userName email role").sort({createdAt:-1});
        res.status(200).json({success:true,data:logs});
    } catch (error) {
        res.status(500).json({success:false,error:"SERVER ERROR"})
    }
}