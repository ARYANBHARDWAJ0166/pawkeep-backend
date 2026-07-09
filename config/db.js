const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");
        console.log("Host:", conn.connection.host);
        console.log("Database:", conn.connection.name);
    } catch (err) {
        console.log("============= FULL ERROR =============");
        console.log(err);
        console.log("======================================");
        process.exit(1);
    }
};

module.exports = connectDB;