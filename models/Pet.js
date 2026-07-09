const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        // ===== OWNER REFERENCE =====
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ===== REQUIRED FIELDS =====
        name: {
            type: String,
            required: [true, "Pet name is required"],
            trim: true,
            maxlength: [50, "Pet name cannot exceed 50 characters"]
        },

        species: {
            type: String,
            required: [true, "Species is required"],
            enum: {
                values: ["dog", "cat", "bird", "rabbit", "fish", "reptile", "other"],
                message: "Invalid species"
            }
        },

        // ===== OPTIONAL FIELDS =====
        breed: {
            type: String,
            trim: true
        },

        age: {
            type: Number,
            min: [0, "Age cannot be negative"]
        },

        gender: {
            type: String,
            enum: {
                values: ["male", "female", "unknown"],
                message: "Gender must be male, female or unknown"
            },
            default: "unknown"
        },

        weight: {
            type: Number,
            min: [0, "Weight cannot be negative"]
        },

        color: {
            type: String,
            trim: true
        },

        photo: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"]
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

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;