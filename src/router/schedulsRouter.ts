import { Router } from "express";
import {
    getSchedules,
    getSingleSchedule,
    removeSchedule,
    updateIsDoneSchedule,
    updateSchedule,
    // validationBody,
    addSchedule,
} from "../controller/scheduleController";
// import { verifyExistSchedule } from "../controller/verifyController";

const router = Router();

router.get("/", getSchedules);

// router.post("/", validationBody, createSchedule);
router.post("/", addSchedule);

// router.get("/:id", validationBody, verifyExistSchedule, getSingleSchedule);
router.get("/:id", getSingleSchedule);

router.patch("/:id", updateSchedule);

router.patch("/status/:id", updateIsDoneSchedule);

router.delete("/:id", removeSchedule);

export default router;