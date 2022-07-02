const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            require: true,
            trim: true,
            uppercase: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        logoLink: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
