import { Router } from "express"
import { sendMessage, getAllMessages } from "../controllers/message.controller.js";
import {isAdminAuthenticated} from "../middleware/auth.middleware.js"

const router = Router();

router.route("/send").post(sendMessage)
router.route("/getAllMessages").get(isAdminAuthenticated, getAllMessages)

export default router;