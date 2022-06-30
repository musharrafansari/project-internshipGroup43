const internModel = require("../models/internModel");
const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");

const createIntern = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "You must enter data." });
    }
    
    const { name, email, mobile, collegeName, isDeleted } = data;
    if(!isDeleted){
      data.isDeleted = false;
    }
    /////////////checking whether all the required inputs are given or not////////////
    if (!name) {
      return res.status(400).send({ status: false, msg: "name is mandatory" });
    }
    if (!email) {
      return res.status(400).send({ status: false, msg: "email is mandatory." });
    }
    if (!mobile) {
      return res.status(400).send({ status: false, msg: "mobile no. is mandatory" });
    }
    if (!collegeName) {
      return res.status(400).send({ status: false, msg: "Please enter College name in order to apply for the Intern" });
    }
    ///////////////////checking the format of the inputs///////////////////////////
    
    if (!/^[a-zA-Z_ ]+$/.test(name)) {
      return res.status(400).send({ status: false, msg: "Enter valid name." });
    }    
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({ status: false, msg: "Enter a valid emailId." });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).send({ status: false, msg: "Enter valid mobile no." });
    }
    
    //////////////////////checking whether unique attributes are present in our DB or not/////////////
    
    let getEmail = await internModel.findOne({ email });
    if (getEmail) { 
        return res.status(400).send({status: false, msg: "Email is already present.Enter a new email",});
    }
    let getMobile = await internModel.findOne({ mobile });
    if (getMobile) {
      return res.status(400).send({status: false, msg: "Mobile no. is already present.Enter a new mobile no.",});
    }
    ///////////////checking for the college name document in the DB////////////////////
    
    let getCollege = await collegeModel.findOne({name:collegeName});
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
    res.status(201).send({status: true, msg: "Intern Created successfully", data: internData});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = {createIntern};
