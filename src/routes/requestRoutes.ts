import {Router} from "express";
import upload from "../middleware/cloudinaryConfig/multerConfig.js";
import { CreateRequest, deleteRequest, getAllRequests, getRequest } from "../controllers/requestController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router=Router();

router.post("/",upload.single("image"),CreateRequest);
router.get("/",AuthMiddleware,getAllRequests);
router.get("/:id",AuthMiddleware,getRequest);
router.delete("/:id",AuthMiddleware,deleteRequest);

export default router;