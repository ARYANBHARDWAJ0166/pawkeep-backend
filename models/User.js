const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address"
            ]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false
        },

        phone: {
            type: String,
            trim: true,
            match: [
                /^[0-9]{10,15}$/,
                "Please provide a valid phone number"
            ]
        },

        profilePicture: {
            type: String,
            default: ""
        },

        address: {
            type: String,
            trim: true
        },

        city: {
            type: String,
            trim: true
        },

        state: {
            type: String,
            trim: true
        },

        country: {
            type: String,
            trim: true
        },

        role: {
            type: String,
            enum: ["user", "admin", "vet"],
            default: "user"
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        accountStatus: {
            type: String,
            enum: ["active", "suspended", "deleted"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return; 
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;