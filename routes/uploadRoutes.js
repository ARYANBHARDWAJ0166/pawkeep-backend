const express = require("express");
const router = express.Router();

const { uploadProfilePicture, uploadPetPhoto } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All routes are protected
router.use(protect);

// POST /api/upload/profile
router.post("/profile", upload.single("image"), uploadProfilePicture);

// POST /api/upload/pet/:petId
router.post("/pet/:petId", upload.single("image"), uploadPetPhoto);

module.exports = router;