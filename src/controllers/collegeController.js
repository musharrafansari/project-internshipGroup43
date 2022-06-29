const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const { default: mongoose } = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === Number && value.trim().length === 0) return false;
  return true;
};

const createCollege = async function (req, res) {
  try {
    let data = req.body;
    let { name, fullName, logoLink } = data;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Data is required" });
    }

    if (!name) {
      return res.status(400).send({ status: false, msg: "Name is mandatory" });
    }
    if (!isValid(name)) {
      return res.status(400).send({ status: false, msg: "Enter valid name" });
    }
    let getCollegeName = await collegeModel.findOne({name})
    if(getCollegeName){
        res.status(400).send({status: false, msg: `${name} is already listed`})
    }
    
    if (!fullName) {
      return res.status(400).send({ status: false, msg: "Full name is mandatory" });
    }
    if (!isValid(fullName)) {
      return res.status(400).send({ status: false, msg: "Enter valid Full name" });
    }

    if (!logoLink) {
      return res.status(400).send({ status: false, msg: "Logolink is mandatory" });
    }
    if (!/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(logoLink)) {
      return res.status(400).send({ status: false, msg: "Enter a valid logolink." });
    }

    let collegeData = await collegeModel.create(data);
    res.status(201).send({status: true, msg: "College Created successfully", data: collegeData,});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const collegeDetails = async function (req, res) {
  let collegeName = req.query.collegeName;

  if (!collegeName) {
    return res.status(400).send({ status: false, msg: "Collegename is required." });
  }

  let collegeDetails = await collegeModel.findOne({ name: collegeName });
  if (!collegeDetails) {
    return res.status(400).send({ status: false, msg: "Collegename is not listed." });
  }

  let internDetails = await internModel.find({ collegeId: collegeDetails._id }).select({ name: 1, email: 1, mobile: 1, _id: 1 });

  let result = {
    name: collegeDetails.name,
    fullName: collegeDetails.fullName,
    logoLink: collegeDetails.logoLink,
    interns: [internDetails],
  };
  res.status(200).send({ status: true, data: result });
};
module.exports = { createCollege, collegeDetails };
