const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    // verifyCode: {
    //     type: String,
    //     required: function () {
    //         return this.role === "SuperAdmin";
    //     },
    // },
    // verifyCodeExpiry: {
    //     type: Date,
    //     required: function () {
    //         return this.role === "SuperAdmin";
    //     },
    // },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: [
            "SuperAdmin",
            "Admin",
            "User",
        ],
        required: [true, "Role is required"],
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid 10-digit number!`,
        },
    },
})

module.exports = new mongoose.model("User", userSchema)