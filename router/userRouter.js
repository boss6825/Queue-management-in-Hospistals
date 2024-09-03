import express from "express";
import { addNewDoctor, getAllDoctors, getUserDetails, logoutAdmin, logoutPatient, patientRegister } from "../controller/userController.js";
import {login} from "../controller/userController.js";
import { addNewAdmin } from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew",isAdminAuthenticated, addNewAdmin);
router.get("/doctors",getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);  //isAdminAuthenticated and isPatientAuthenticated are middlewares here
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor); //isAdminAuthenticated is used beacause oly admin can add new doctor




export default router;