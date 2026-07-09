const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
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
            required: [true, "Reminder title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"]
        },

        dueDate: {
            type: Date,
            required: [true, "Due date is required"]
        },

        // ===== OPTIONAL FIELDS =====
        type: {
            type: String,
            enum: {
                values: [
                    "vaccination",
                    "appointment",
                    "medication",
                    "grooming",
                    "deworming",
                    "other"
                ],
                message: "Invalid reminder type"
            },
            default: "other"
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"]
        },

        isCompleted: {
            type: Boolean,
            default: false
        },

        completedAt: {
            type: Date
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

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;