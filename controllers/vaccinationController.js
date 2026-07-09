const Vaccination = require("../models/Vaccination");
const Pet = require("../models/Pet");
const sendResponse = require("../utils/sendResponse");

// ===== CREATE VACCINATION =====

const createVaccination = async (req, res) => {
    try {
        const {
            pet,
            vaccineName,
            dateAdministered,
            nextDueDate,
            vetName,
            clinicName,
            batchNumber,
            notes,
            status
        } = req.body;

        // Step 1: Check required fields
        if (!pet || !vaccineName || !dateAdministered) {
            return sendResponse(res, 400, false, "Pet, vaccine name and date administered are required");
        }

        // Step 2: Check if pet exists and belongs to user
        const petExists = await Pet.findById(pet);

        if (!petExists) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        if (petExists.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to add vaccination for this pet");
        }

        // Step 3: Create vaccination
        const vaccination = await Vaccination.create({
            owner: req.user._id,
            pet,
            vaccineName,
            dateAdministered,
            nextDueDate,
            vetName,
            clinicName,
            batchNumber,
            notes,
            status
        });

        // Step 4: Populate pet details
        const populatedVaccination = await Vaccination.findById(vaccination._id)
            .populate("pet", "name species breed");

        return sendResponse(res, 201, true, "Vaccination record created successfully", populatedVaccination);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET ALL MY VACCINATIONS =====

const getMyVaccinations = async (req, res) => {
    try {
        const vaccinations = await Vaccination.find({
            owner: req.user._id,
            isActive: true
        })
        .populate("pet", "name species breed")
        .sort({ dateAdministered: -1 });

        return sendResponse(res, 200, true, "Vaccinations fetched successfully", vaccinations);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET VACCINATIONS BY PET =====

const getVaccinationsByPet = async (req, res) => {
    try {
        // Check if pet exists and belongs to user
        const petExists = await Pet.findById(req.params.petId);

        if (!petExists) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        if (petExists.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view vaccinations for this pet");
        }

        const vaccinations = await Vaccination.find({
            pet: req.params.petId,
            isActive: true
        })
        .populate("pet", "name species breed")
        .sort({ dateAdministered: -1 });

        return sendResponse(res, 200, true, "Vaccinations fetched successfully", vaccinations);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET SINGLE VACCINATION =====

const getVaccinationById = async (req, res) => {
    try {
        const vaccination = await Vaccination.findById(req.params.id)
            .populate("pet", "name species breed");

        if (!vaccination) {
            return sendResponse(res, 404, false, "Vaccination record not found");
        }

        if (vaccination.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view this vaccination record");
        }

        return sendResponse(res, 200, true, "Vaccination fetched successfully", vaccination);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== UPDATE VACCINATION =====

const updateVaccination = async (req, res) => {
    try {
        const vaccination = await Vaccination.findById(req.params.id);

        if (!vaccination) {
            return sendResponse(res, 404, false, "Vaccination record not found");
        }

        if (vaccination.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to update this vaccination record");
        }

        const updatedVaccination = await Vaccination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("pet", "name species breed");

        return sendResponse(res, 200, true, "Vaccination updated successfully", updatedVaccination);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== DELETE VACCINATION =====

const deleteVaccination = async (req, res) => {
    try {
        const vaccination = await Vaccination.findById(req.params.id);

        if (!vaccination) {
            return sendResponse(res, 404, false, "Vaccination record not found");
        }

        if (vaccination.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to delete this vaccination record");
        }

        vaccination.isActive = false;
        await vaccination.save();

        return sendResponse(res, 200, true, "Vaccination record deleted successfully");

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = {
    createVaccination,
    getMyVaccinations,
    getVaccinationsByPet,
    getVaccinationById,
    updateVaccination,
    deleteVaccination
};