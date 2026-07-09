const Appointment = require("../models/Appointment");
const Pet = require("../models/Pet");
const sendResponse = require("../utils/sendResponse");

// ===== CREATE APPOINTMENT =====

const createAppointment = async (req, res) => {
    try {
        const { pet, title, date, time, vetName, clinicName, clinicAddress, reason, notes } = req.body;

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
            return sendResponse(res, 403, false, "You are not authorized to create appointment for this pet");
        }

        // Step 3: Create appointment
        const appointment = await Appointment.create({
            owner: req.user._id,
            pet,
            title,
            date,
            time,
            vetName,
            clinicName,
            clinicAddress,
            reason,
            notes
        });

        // Step 4: Populate pet details in response
        const populatedAppointment = await Appointment.findById(appointment._id).populate("pet", "name species breed");

        return sendResponse(res, 201, true, "Appointment created successfully", populatedAppointment);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET ALL MY APPOINTMENTS =====

const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            owner: req.user._id,
            isActive: true
        })
        .populate("pet", "name species breed")
        .sort({ date: 1 });

        return sendResponse(res, 200, true, "Appointments fetched successfully", appointments);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET SINGLE APPOINTMENT =====

const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate("pet", "name species breed");

        // Check if appointment exists
        if (!appointment) {
            return sendResponse(res, 404, false, "Appointment not found");
        }

        // Check if appointment belongs to logged in user
        if (appointment.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view this appointment");
        }

        return sendResponse(res, 200, true, "Appointment fetched successfully", appointment);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== UPDATE APPOINTMENT =====

const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        // Check if appointment exists
        if (!appointment) {
            return sendResponse(res, 404, false, "Appointment not found");
        }

        // Check if appointment belongs to logged in user
        if (appointment.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to update this appointment");
        }

        // Update appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("pet", "name species breed");

        return sendResponse(res, 200, true, "Appointment updated successfully", updatedAppointment);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== DELETE APPOINTMENT =====

const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        // Check if appointment exists
        if (!appointment) {
            return sendResponse(res, 404, false, "Appointment not found");
        }

        // Check if appointment belongs to logged in user
        if (appointment.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to delete this appointment");
        }

        // Soft delete
        appointment.isActive = false;
        await appointment.save();

        return sendResponse(res, 200, true, "Appointment deleted successfully");

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = {
    createAppointment,
    getMyAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};