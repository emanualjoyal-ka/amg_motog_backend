import {Router} from "express"
import { createContact, deleteContact, getAllContacts, getContact } from "../controllers/contactControler.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router=Router();

router.post("/",createContact);
router.get("/",AuthMiddleware,getAllContacts);
router.get("/:id",AuthMiddleware,getContact);
router.delete("/:id",AuthMiddleware,deleteContact);

export default router;