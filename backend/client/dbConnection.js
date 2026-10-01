const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL || "");
        console.log("database connected successfully")
    } catch (error) {
        console.error("error connect database", error)
    }
};

module.exports = dbConnection;