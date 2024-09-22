import { Router } from "express";
import {
  isPatientAuthenticated,
  isAdminAuthenticated,
} from "../middleware/auth.middleware.js";
import {
  appointment,
  getAllAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from "../controllers/appointment.controller.js";

const router = Router();

router.route("/post").post(isPatientAuthenticated, appointment);
router.route("/allAppointment").get(isAdminAuthenticated, getAllAppointment);
router.route("/updateAppointmentStatus/:id").put(isAdminAuthenticated, updateAppointmentStatus);
router.route("/updateAppointmentStatus/:id").delete(isAdminAuthenticated, deleteAppointment);

export default router;
