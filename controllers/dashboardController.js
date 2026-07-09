const Pet = require("../models/Pet");
const Appointment = require("../models/Appointment");
const Vaccination = require("../models/Vaccination");
const HealthRecord = require("../models/HealthRecord");
const Reminder = require("../models/Reminder");
const sendResponse = require("../utils/sendResponse");

// ===== GET DASHBOARD STATS =====

const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();

        // ===== PETS =====
        const totalPets = await Pet.countDocuments({
            owner: userId,
            isActive: true
        });

        // ===== APPOINTMENTS =====
        const totalAppointments = await Appointment.countDocuments({
            owner: userId,
            isActive: true
        });

        const upcomingAppointments = await Appointment.find({
            owner: userId,
            isActive: true,
            status: "scheduled",
            date: { $gte: today }
        })
        .populate("pet", "name species")
        .sort({ date: 1 })
        .limit(5);

        // ===== VACCINATIONS =====
        const totalVaccinations = await Vaccination.countDocuments({
            owner: userId,
            isActive: true
        });

        const upcomingVaccinations = await Vaccination.find({
            owner: userId,
            isActive: true,
            nextDueDate: { $gte: today }
        })
        .populate("pet", "name species")
        .sort({ nextDueDate: 1 })
        .limit(5);

        // ===== HEALTH RECORDS =====
        const totalHealthRecords = await HealthRecord.countDocuments({
            owner: userId,
            isActive: true
        });

        // ===== REMINDERS =====
        const totalReminders = await Reminder.countDocuments({
            owner: userId,
            isActive: true
        });

        const upcomingReminders = await Reminder.find({
            owner: userId,
            isActive: true,
            isCompleted: false,
            dueDate: { $gte: today }
        })
        .populate("pet", "name species")
        .sort({ dueDate: 1 })
        .limit(5);

        // ===== RECENT PETS =====
        const recentPets = await Pet.find({
            owner: userId,
            isActive: true
        })
        .sort({ createdAt: -1 })
        .limit(5);

        // ===== BUILD RESPONSE =====
        const dashboardData = {
            stats: {
                totalPets,
                totalAppointments,
                totalVaccinations,
                totalHealthRecords,
                totalReminders
            },
            upcomingAppointments,
            upcomingVaccinations,
            upcomingReminders,
            recentPets
        };

        return sendResponse(res, 200, true, "Dashboard data fetched successfully", dashboardData);

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = { getDashboard };