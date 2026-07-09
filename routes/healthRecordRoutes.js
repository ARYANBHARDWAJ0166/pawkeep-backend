const express = require("express");
const router = express.Router();

const {
    createHealthRecord,
    getMyHealthRecords,
    getHealthRecordsByPet,
    getHealthRecordById,
    updateHealthRecord,
    deleteHealthRecord
} = require("../controllers/healthRecordController");

const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", createHealthRecord);
router.get("/", getMyHealthRecords);
router.get("/pet/:petId", getHealthRecordsByPet);
router.get("/:id", getHealthRecordById);
router.put("/:id", updateHealthRecord);
router.delete("/:id", deleteHealthRecord);

module.exports = router;