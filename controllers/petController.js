const Pet = require("../models/Pet");
const sendResponse = require("../utils/sendResponse");

// ===== CREATE PET =====

const createPet = async (req, res) => {
    try {
        const { name, species, breed, age, gender, weight, color, notes } = req.body;

        // Check required fields
        if (!name || !species) {
            return sendResponse(res, 400, false, "Pet name and species are required");
        }

        // Create pet with owner set to logged in user
        const pet = await Pet.create({
            owner: req.user._id,
            name,
            species,
            breed,
            age,
            gender,
            weight,
            color,
            notes
        });

        return sendResponse(res, 201, true, "Pet created successfully", pet);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET ALL MY PETS =====

const getMyPets = async (req, res) => {
    try {
        // Find all pets where owner matches logged in user
        const pets = await Pet.find({ owner: req.user._id, isActive: true });

        return sendResponse(res, 200, true, "Pets fetched successfully", pets);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET SINGLE PET =====

const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        // Check if pet exists
        if (!pet) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        // Check if this pet belongs to the logged in user
        if (pet.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view this pet");
        }

        return sendResponse(res, 200, true, "Pet fetched successfully", pet);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== UPDATE PET =====

const updatePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        // Check if pet exists
        if (!pet) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        // Check if this pet belongs to the logged in user
        if (pet.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to update this pet");
        }

        // Update the pet
        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        return sendResponse(res, 200, true, "Pet updated successfully", updatedPet);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== DELETE PET =====

const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        // Check if pet exists
        if (!pet) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        // Check if this pet belongs to the logged in user
        if (pet.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to delete this pet");
        }

        // Soft delete - just mark as inactive
        pet.isActive = false;
        await pet.save();

        return sendResponse(res, 200, true, "Pet deleted successfully");

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = { createPet, getMyPets, getPetById, updatePet, deletePet };