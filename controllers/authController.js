const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");

// ===== HELPER: GENERATE JWT TOKEN =====

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// ===== REGISTER USER =====

const registerUser = async (req, res) => {
    try {
        // Step 1: Get data from request body
        const { name, email, password, phone } = req.body;

        // Step 2: Check required fields
        if (!name || !email || !password) {
            return sendResponse(res, 400, false, "Name, email and password are required");
        }

        // Step 3: Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return sendResponse(res, 400, false, "Email is already registered");
        }

        // Step 4: Create new user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        // Step 5: Generate token
        const token = generateToken(user._id);

        // Step 6: Send success response
        return sendResponse(res, 201, true, "Account created successfully", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                accountStatus: user.accountStatus,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            return sendResponse(res, 400, false, messages.join(", "));
        }

        if (err.code === 11000) {
            return sendResponse(res, 400, false, "Email is already registered");
        }

        return sendResponse(res, 500, false, err.message);
    }
};

// ===== LOGIN USER =====

const loginUser = async (req, res) => {
    try {
        // Step 1: Get email and password from request body
        const { email, password } = req.body;

        // Step 2: Check required fields
        if (!email || !password) {
            return sendResponse(res, 400, false, "Email and password are required");
        }

        // Step 3: Find user by email and include password field
        const user = await User.findOne({ email }).select("+password");

        // Step 4: Check if user exists
        if (!user) {
            return sendResponse(res, 401, false, "Invalid email or password");
        }

        // Step 5: Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return sendResponse(res, 401, false, "Invalid email or password");
        }

        // Step 6: Check account status
        if (user.accountStatus !== "active") {
            return sendResponse(res, 403, false, "Your account has been suspended");
        }

        // Step 7: Generate token
        const token = generateToken(user._id);

        // Step 8: Send success response
        return sendResponse(res, 200, true, "Login successful", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                accountStatus: user.accountStatus,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

// ===== GET CURRENT USER =====

const getMe = async (req, res) => {
    try {
        return sendResponse(res, 200, true, "User fetched successfully", {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            profilePicture: req.user.profilePicture,
            address: req.user.address,
            city: req.user.city,
            state: req.user.state,
            country: req.user.country,
            isEmailVerified: req.user.isEmailVerified,
            accountStatus: req.user.accountStatus,
            createdAt: req.user.createdAt
        });
    } catch (err) {
        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = { registerUser, loginUser, getMe };