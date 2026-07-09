const express = require("express");
const router = express.Router();

const {
    createVaccination,
    getMyVaccinations,
    getVaccinationsByPet,
    getVaccinationById,
    updateVaccination,
    deleteVaccination
} = require("../controllers/vaccinationController");

const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", createVaccination);
router.get("/", getMyVaccinations);
router.get("/pet/:petId", getVaccinationsByPet);
router.get("/:id", getVaccinationById);
router.put("/:id", updateVaccination);
router.delete("/:id", deleteVaccination);

module.exports = router;