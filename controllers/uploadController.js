const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const Pet = require("../models/Pet");
const sendResponse = require("../utils/sendResponse");

// ===== HELPER: UPLOAD BUFFER TO CLOUDINARY =====

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// ===== UPLOAD PROFILE PICTURE =====

const uploadProfilePicture = async (req, res) => {
    try {
        // Check if file was sent
        if (!req.file) {
            return sendResponse(res, 400, false, "Please upload an image file");
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer,
            "pawkeep/profiles"
        );

        // Save URL to user profile
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: result.secure_url },
            { new: true }
        );

        return sendResponse(res, 200, true, "Profile picture uploaded successfully", {
            profilePicture: user.profilePicture
        });

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== UPLOAD PET PHOTO =====

const uploadPetPhoto = async (req, res) => {
    try {
        // Check if file was sent
        if (!req.file) {
            return sendResponse(res, 400, false, "Please upload an image file");
        }

        // Check if pet exists and belongs to user
        const pet = await Pet.findById(req.params.petId);

        if (!pet) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        if (pet.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to update this pet");
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer,
            "pawkeep/pets"
        );

        // Save URL to pet
        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.petId,
            { photo: result.secure_url },
            { new: true }
        );

        return sendResponse(res, 200, true, "Pet photo uploaded successfully", {
            photo: updatedPet.photo
        });

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = { uploadProfilePicture, uploadPetPhoto };