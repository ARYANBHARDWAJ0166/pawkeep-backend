const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");

const protect = async (req, res, next) => {
    try {
        let token;

        // Step 1: Check if Authorization header exists and starts with Bearer
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Step 2: Extract token from "Bearer TOKEN"
            token = req.headers.authorization.split(" ")[1];
        }

        // Step 3: If no token found, stop here
        if (!token) {
            return sendResponse(res, 401, false, "Access denied. No token provided.");
        }

        // Step 4: Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 5: Find the user from decoded token id
        const user = await User.findById(decoded.id);

        // Step 6: Check if user still exists
        if (!user) {
            return sendResponse(res, 401, false, "User no longer exists.");
        }

        // Step 7: Check if account is active
        if (user.accountStatus !== "active") {
            return sendResponse(res, 403, false, "Your account has been suspended.");
        }

        // Step 8: Attach user to request object
        req.user = user;

        // Step 9: Continue to the next middleware or controller
        next();

    } catch (err) {
        // Handle expired token
        if (err.name === "TokenExpiredError") {
            return sendResponse(res, 401, false, "Token has expired. Please login again.");
        }

        // Handle invalid token
        if (err.name === "JsonWebTokenError") {
            return sendResponse(res, 401, false, "Invalid token. Please login again.");
        }

        return sendResponse(res, 500, false, err.message);
    }
};

module.exports = { protect };