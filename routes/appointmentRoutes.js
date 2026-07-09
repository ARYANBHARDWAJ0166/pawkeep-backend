const express = require("express");
const router = express.Router();

const {
    createAppointment,
    getMyAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", createAppointment);
router.get("/", getMyAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;