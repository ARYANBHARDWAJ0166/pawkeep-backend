const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        // ===== REFERENCES =====
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: [true, "Pet is required"]
        },

        // ===== REQUIRED FIELDS =====
        title: {
            type: String,
            required: [true, "Appointment title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"]
        },

        date: {
            type: Date,
            required: [true, "Appointment date is required"]
        },

        // ===== OPTIONAL FIELDS =====
        time: {
            type: String,
            trim: true
        },

        vetName: {
            type: String,
            trim: true
        },

        clinicName: {
            type: String,
            trim: true
        },

        clinicAddress: {
            type: String,
            trim: true
        },

        reason: {
            type: String,
            trim: true,
            maxlength: [500, "Reason cannot exceed 500 characters"]
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"]
        },

        status: {
            type: String,
            enum: {
                values: ["scheduled", "completed", "cancelled"],
                message: "Status must be scheduled, completed or cancelled"
            },
            default: "scheduled"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;