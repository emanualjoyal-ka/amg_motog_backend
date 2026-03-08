import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";
import multer from "multer";


const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:async (req,file)=>{
        return{
            folder:"amg_motog_uploads",
            allowed_formats:['jpg','png','jpeg'],
            transformation:[{width:1000,height:1000,crop:'limit'}],
            public_id:`file_${Date.now()}`
        }
    }
})


const upload=multer({
    storage:storage,
    limits:{fileSize:5*1024*1024}
})

export default upload;