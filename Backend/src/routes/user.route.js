import { Router } from "express";
import upload from "../middleware/multer.middleware.js"
import {
  logoutPatient,
  logoutAdmin,
  loginUser,
  registerUser,
  signupNewAdmin,
  getAllDoctors,
  userDetails,
  addNewDoctor
} from "../controllers/user.controller.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/admin/signup").post(signupNewAdmin);
router.route("/doctors").get(getAllDoctors);
router.route("/admin/me").get(isAdminAuthenticated, userDetails);
router.route("/patient/me").get(isPatientAuthenticated, userDetails);

router.route("/patient/logout").get(isPatientAuthenticated, logoutPatient);
router.route("/admin/logout").get(isAdminAuthenticated, logoutAdmin);

router.route("/addDoctor").post(isAdminAuthenticated, upload.single("avatar"), addNewDoctor)

export default router;
