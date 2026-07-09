const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
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
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"]
        },

        date: {
            type: Date,
            required: [true, "Date is required"]
        },

        // ===== OPTIONAL FIELDS =====
        type: {
            type: String,
            enum: {
                values: [
                    "checkup",
                    "surgery",
                    "diagnosis",
                    "treatment",
                    "test",
                    "other"
                ],
                message: "Invalid record type"
            },
            default: "checkup"
        },

        vetName: {
            type: String,
            trim: true
        },

        clinicName: {
            type: String,
            trim: true
        },

        diagnosis: {
            type: String,
            trim: true,
            maxlength: [500, "Diagnosis cannot exceed 500 characters"]
        },

        treatment: {
            type: String,
            trim: true,
            maxlength: [500, "Treatment cannot exceed 500 characters"]
        },

        medications: {
            type: String,
            trim: true,
            maxlength: [500, "Medications cannot exceed 500 characters"]
        },

        weight: {
            type: Number,
            min: [0, "Weight cannot be negative"]
        },

        temperature: {
            type: Number
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [1000, "Notes cannot exceed 1000 characters"]
        },

        followUpDate: {
            type: Date
        },

        cost: {
            type: Number,
            min: [0, "Cost cannot be negative"]
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

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);

module.exports = HealthRecord;