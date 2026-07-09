const express = require("express");
const router = express.Router();

const {
    createPet,
    getMyPets,
    getPetById,
    updatePet,
    deletePet
} = require("../controllers/petController");

const { protect } = require("../middleware/authMiddleware");

// All routes below are protected
router.use(protect);

router.post("/", createPet);
router.get("/", getMyPets);
router.get("/:id", getPetById);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

module.exports = router;