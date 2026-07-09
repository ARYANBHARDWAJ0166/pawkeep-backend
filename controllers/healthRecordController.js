const HealthRecord = require("../models/HealthRecord");
const Pet = require("../models/Pet");
const sendResponse = require("../utils/sendResponse");

// ===== CREATE HEALTH RECORD =====

const createHealthRecord = async (req, res) => {
    try {
        const {
            pet,
            title,
            date,
            type,
            vetName,
            clinicName,
            diagnosis,
            treatment,
            medications,
            weight,
            temperature,
            notes,
            followUpDate,
            cost
        } = req.body;

        // Step 1: Check required fields
        if (!pet || !title || !date) {
            return sendResponse(res, 400, false, "Pet, title and date are required");
        }

        // Step 2: Check if pet exists and belongs to user
        const petExists = await Pet.findById(pet);

        if (!petExists) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        if (petExists.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to add health record for this pet");
        }

        // Step 3: Create health record
        const healthRecord = await HealthRecord.create({
            owner: req.user._id,
            pet,
            title,
            date,
            type,
            vetName,
            clinicName,
            diagnosis,
            treatment,
            medications,
            weight,
            temperature,
            notes,
            followUpDate,
            cost
        });

        // Step 4: Populate pet details
        const populatedRecord = await HealthRecord.findById(healthRecord._id)
            .populate("pet", "name species breed");

        return sendResponse(res, 201, true, "Health record created successfully", populatedRecord);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET ALL MY HEALTH RECORDS =====

const getMyHealthRecords = async (req, res) => {
    try {
        const healthRecords = await HealthRecord.find({
            owner: req.user._id,
            isActive: true
        })
        .populate("pet", "name species breed")
        .sort({ date: -1 });

        return sendResponse(res, 200, true, "Health records fetched successfully", healthRecords);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET HEALTH RECORDS BY PET =====

const getHealthRecordsByPet = async (req, res) => {
    try {
        // Check if pet exists and belongs to user
        const petExists = await Pet.findById(req.params.petId);

        if (!petExists) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        if (petExists.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view health records for this pet");
        }

        const healthRecords = await HealthRecord.find({
            pet: req.params.petId,
            isActive: true
        })
        .populate("pet", "name species breed")
        .sort({ date: -1 });

        return sendResponse(res, 200, true, "Health records fetched successfully", healthRecords);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET SINGLE HEALTH RECORD =====

const getHealthRecordById = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id)
            .populate("pet", "name species breed");

        if (!healthRecord) {
            return sendResponse(res, 404, false, "Health record not found");
        }

        if (healthRecord.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view this health record");
        }

        return sendResponse(res, 200, true, "Health record fetched successfully", healthRecord);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== UPDATE HEALTH RECORD =====

const updateHealthRecord = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);

        if (!healthRecord) {
            return sendResponse(res, 404, false, "Health record not found");
        }

        if (healthRecord.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to update this health record");
        }

        const updatedRecord = await HealthRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("pet", "name species breed");

        return sendResponse(res, 200, true, "Health record updated successfully", updatedRecord);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== DELETE HEALTH RECORD =====

const deleteHealthRecord = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);

        if (!healthRecord) {
            return sendResponse(res, 404, false, "Health record not found");
        }

        if (healthRecord.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to delete this health record");
        }

        healthRecord.isActive = false;
        await healthRecord.save();

        return sendResponse(res, 200, true, "Health record deleted successfully");

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = {
    createHealthRecord,
    getMyHealthRecords,
    getHealthRecordsByPet,
    getHealthRecordById,
    updateHealthRecord,
    deleteHealthRecord
};