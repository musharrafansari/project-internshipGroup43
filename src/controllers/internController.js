const internModel = require("../models/internModel");
const { default: mongoose } = require("mongoose");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}

const isValidEmail = function(value){
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))){
        return res.status(400).send({status: false, msg:"Please enter a valid Email Id"});
    }
}

const isValidMobile = function(value){
    if(!(/^\d{10}$/.test(value))){
        
    }
}

