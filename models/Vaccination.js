const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema(
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
        vaccineName: {
            type: String,
            required: [true, "Vaccine name is required"],
            trim: true,
            maxlength: [100, "Vaccine name cannot exceed 100 characters"]
        },

        dateAdministered: {
            type: Date,
            required: [true, "Date administered is required"]
        },

        // ===== OPTIONAL FIELDS =====
        nextDueDate: {
            type: Date
        },

        vetName: {
            type: String,
            trim: true
        },

        clinicName: {
            type: String,
            trim: true
        },

        batchNumber: {
            type: String,
            trim: true
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"]
        },

        status: {
            type: String,
            enum: {
                values: ["completed", "upcoming", "overdue"],
                message: "Status must be completed, upcoming or overdue"
            },
            default: "completed"
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

const Vaccination = mongoose.model("Vaccination", vaccinationSchema);

module.exports = Vaccination;