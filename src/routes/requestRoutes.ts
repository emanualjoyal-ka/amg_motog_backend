import {Router} from "express";
import upload from "../middleware/cloudinaryConfig/multerConfig.js";
import { CreateRequest, deleteRequest, getAllRequests, getRequest } from "../controllers/requestController.js";

const router=Router();

router.post("/",upload.single("image"),CreateRequest);
router.get("/",getAllRequests);
router.get("/:id",getRequest);
router.delete("/:id",deleteRequest);

export default router;