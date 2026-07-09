const Reminder = require("../models/Reminder");
const Pet = require("../models/Pet");
const sendResponse = require("../utils/sendResponse");

const createReminder = async (req, res) => {
    try {
        const { pet, title, dueDate, type, notes } = req.body;

        if (!pet || !title || !dueDate) {
            return sendResponse(res, 400, false, "Pet, title and due date are required");
        }

        const petExists = await Pet.findById(pet);

        if (!petExists) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        if (petExists.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to add reminder for this pet");
        }

        const reminder = await Reminder.create({
            owner: req.user._id,
            pet,
            title,
            dueDate,
            type,
            notes
        });

        const populatedReminder = await Reminder.findById(reminder._id)
            .populate("pet", "name species breed");

        return sendResponse(res, 201, true, "Reminder created successfully", populatedReminder);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

const getMyReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({
            owner: req.user._id,
            isActive: true
        })
        .populate("pet", "name species breed")
        .sort({ dueDate: 1 });

        return sendResponse(res, 200, true, "Reminders fetched successfully", reminders);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

const getUpcomingReminders = async (req, res) => {
    try {
        const today = new Date();

        const reminders = await Reminder.find({
            owner: req.user._id,
            isActive: true,
            isCompleted: false,
            dueDate: { $gte: today }
        })
        .populate("pet", "name species breed")
        .sort({ dueDate: 1 });

        return sendResponse(res, 200, true, "Upcoming reminders fetched successfully", reminders);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

const getRemindersByPet = async (req, res) => {
    try {
        const petExists = await Pet.findById(req.params.petId);

        if (!petExists) {
            return sendResponse(res, 404, false, "Pet not found");
        }

        if (petExists.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view reminders for this pet");
        }

        const reminders = await Reminder.find({
            pet: req.params.petId,
            isActive: true
        })
        .populate("pet", "name species breed")
        .sort({ dueDate: 1 });

        return sendResponse(res, 200, true, "Reminders fetched successfully", reminders);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

const getReminderById = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id)
            .populate("pet", "name species breed");

        if (!reminder) {
            return sendResponse(res, 404, false, "Reminder not found");
        }

        if (reminder.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to view this reminder");
        }

        return sendResponse(res, 200, true, "Reminder fetched successfully", reminder);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

const updateReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return sendResponse(res, 404, false, "Reminder not found");
        }

        if (reminder.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to update this reminder");
        }

        const updatedReminder = await Reminder.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("pet", "name species breed");

        return sendResponse(res, 200, true, "Reminder updated successfully", updatedReminder);

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }
        return sendResponse(res, 500, false, err.message);
    }
};

const completeReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return sendResponse(res, 404, false, "Reminder not found");
        }

        if (reminder.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to complete this reminder");
        }

        reminder.isCompleted = true;
        reminder.completedAt = new Date();
        await reminder.save();

        return sendResponse(res, 200, true, "Reminder marked as completed", reminder);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return sendResponse(res, 404, false, "Reminder not found");
        }

        if (reminder.owner.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "You are not authorized to delete this reminder");
        }

        reminder.isActive = false;
        await reminder.save();

        return sendResponse(res, 200, true, "Reminder deleted successfully");

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = {
    createReminder,
    getMyReminders,
    getUpcomingReminders,
    getRemindersByPet,
    getReminderById,
    updateReminder,
    completeReminder,
    deleteReminder
};