import {Router} from "express"
import { createContact, deleteContact, getAllContacts, getContact } from "../controllers/contactControler.js";

const router=Router();

router.post("/",createContact);
router.get("/",getAllContacts);
router.get("/:id",getContact);
router.delete("/:id",deleteContact);

export default router;