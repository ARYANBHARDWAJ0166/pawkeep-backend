const express = require("express");
const router = express.Router();

const {
    createReminder,
    getMyReminders,
    getUpcomingReminders,
    getRemindersByPet,
    getReminderById,
    updateReminder,
    completeReminder,
    deleteReminder
} = require("../controllers/reminderController");

const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", createReminder);
router.get("/", getMyReminders);
router.get("/upcoming", getUpcomingReminders);
router.get("/pet/:petId", getRemindersByPet);
router.get("/:id", getReminderById);
router.put("/:id", updateReminder);
router.patch("/:id/complete", completeReminder);
router.delete("/:id", deleteReminder);

module.exports = router;