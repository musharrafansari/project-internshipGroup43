const mongoose = require("mongoose");

const collegeModel = new mongoose.Schema({
    name: {type: String,
        unique: true,
         require: true
    },
    fullName: {
        type: String,
        required: true
    },
    logoLine: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

module.export =mongoose.model("College",collegeModel);