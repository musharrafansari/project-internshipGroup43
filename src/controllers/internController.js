const internModel = require("../models/internModel");
const { default: mongoose } = require("mongoose");
const collegeModel = require("../models/collegeModel");

// const isValid = function (value) {
//   if (typeof value === "undefined" || value === null) return false;
//   if (typeof value === "string" && value.trim().length === 0) return false;
//   if (typeof value === Number && value.trim().length === 0) return false;
//   return true;
// };

const createIntern = async function (req, res) {
  try {
    let data = req.body;

    const { name, email, mobile, collegeName, isDeleted } = data;
    if(!isDeleted){
      data.isDeleted = false;
    }

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "You must enter data." });
    }

    if (!name) {
      return res.status(400).send({ status: false, msg: "name is mandatory" });
    }
    if (!/^[a-zA-Z_ ]+$/.test(name.trim())) {
      return res.status(400).send({ status: false, msg: "Enter valid name." });
    }

    if (!email) {
      return res.status(400).send({ status: false, msg: "email is mandatory." });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      return res.status(400).send({ status: false, msg: "Enter a valid emailId." });
    }
    let getEmail = await internModel.findOne({ email });
    if (getEmail) {
        return res.status(400).send({status: false, msg: "Email is already present.Enter a new email",});
    }

    if (!mobile) {
      return res.status(400).send({ status: false, msg: "mobile no. is mandatory" });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).send({ status: false, msg: "Enter valid mobile no." });
    }
    let getMobile = await internModel.findOne({ mobile });
    if (getMobile) {
      return res.status(400).send({status: false, msg: "Mobile no. is already present.Enter a new moile no.",});
    }

    let getCollege = await collegeModel.findOne({name: collegeName});
    if(!getCollege){
        return res.status(400).send({status: false, msg: "No college is listed with that College name"});
    }

    let result = {
      isDeleted: data.isDeleted,
      name: name,
      email: email,
      mobile: mobile,
      collegeId: getCollege._id
    }

    let internData = await internModel.create(result);
    res.status(201).send({status: true, msg: "Intern Created successfully", data: result});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = {createIntern};
