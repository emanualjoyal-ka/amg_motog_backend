import {Router} from "express"
import { createAdmin, deleteAnAdmin, getAllAdmins, getloginLogs, LoginAdmin, LogoutAdmin, refreshToken } from "../controllers/AuthController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";


const router=Router();

router.post("/register",AuthMiddleware,createAdmin);
router.post("/login",LoginAdmin);
router.post("/logout",LogoutAdmin);
router.post("/refresh",refreshToken);
router.get("/all-admins",AuthMiddleware,getAllAdmins);
router.delete("/:id",AuthMiddleware,deleteAnAdmin);
router.get("/get-logs",AuthMiddleware,getloginLogs);

export default router;
