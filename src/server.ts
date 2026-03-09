import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import requestRoutes from "./routes/requestRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"


dotenv.config();

const app=express();
app.use(express.json());

const PORT=process.env.PORT || 3000;
const MONGO_URI=process.env.MONGO_URI || "";

if (!MONGO_URI) {
    console.log("❌ MONGO_URI is not defined in environment variables");
    process.exit(1);
}

mongoose.connect(MONGO_URI).then(()=>{
    console.log("✅ Connected to MONGODB");
}).catch((err)=>{
    console.log("❌ MONGODB failed to connect",err);
    process.exit(1);
})

app.listen(PORT,()=>{
    console.log(`✅ Server is running on http://localhost:${PORT}`)
    
})

app.use("/api/requests",requestRoutes);
app.use("/api/contacts",contactRoutes);



