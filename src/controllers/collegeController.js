const collegeModel = require("../models/colegeModel");
const isUrlValid = require('url-validation');
const { default: mongoose } = require("mongoose");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}
  
const createCollege = async function(req, res){
    try{
    let body = req.body;
    let {name, fullName, logoLink} = body;

    if(mongoose.Object.keys(body) == 0){
        return res.status(400).send({status: false, msg:"Data is required"});
    }
    if(!isValid(name)){
        return res.status(403).send({status: false, msg: "Enter valid name"});
    }
    if(!isValid(fullName)){
        return res.status(403).send({status: false, msg: "Enter valid Full name"});
    }
    if(!isUrlValid(logoLink)){
        return res.status(403).send({status: false, msg: "Enter valid URL"})
    }
    const collegeData = await collegeModel.create(body);
    res.status(201).send({status: true, msg: "College Created successfully", data: collegeData});
    }
    catch(err){
        res.status(500).send({status: false, msg: err.message});
    }
}

module.exports = {createCollege};