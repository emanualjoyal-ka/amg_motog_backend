import {Router} from "express";
import upload from "../middleware/cloudinaryConfig/multerConfig.js";
import { CreateRequest, getAllRequests } from "../controllers/requestController.js";

const router=Router();

router.post("/",upload.single("image"),CreateRequest);
router.get("/",getAllRequests);

export default router;