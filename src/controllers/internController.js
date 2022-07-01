const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

const createIntern = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "You must enter data." });
    }
    
    const { name, email, mobile, collegeName } = data;
   
    //--------------------[checking whether all the required inputs are given or not]-------------------------
    if (!name) {
      return res.status(400).send({ status: false, msg: "Name field if missing" });
    }
    if (!email) {
      return res.status(400).send({ status: false, msg: "Email field is missing" });
    }
    if (!mobile) {
      return res.status(400).send({ status: false, msg: "Mobile number field is missing" });
    }
    if (!collegeName) {
      return res.status(400).send({ status: false, msg: "Please enter College name in order to apply for the Intern" });
    }
    //----------------------------[checking the format of the inputs]----------------------------------------------

    if(name.trim().length !== 0){
      if (!/^[a-zA-Z_ ]+$/.test(name)) {
        return res.status(400).send({ status: false, msg: "Enter valid name" });
      }
    }else return res.status(400).send({ status: false, msg: "Enter valid name" });

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({ status: false, msg: "Enter a valid emailId" });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).send({ status: false, msg: "Enter valid mobile no" });
    }
    
    //-----------------------[checking whether unique attributes are present in our DB or not]--------------------
    
    let getEmail = await internModel.findOne({email});
    if (getEmail) { 
        return res.status(400).send({status: false, msg: `This Email Id is already registered. Enter a new email`});
    }
    let getMobile = await internModel.findOne({mobile});
    if (getMobile) {
      return res.status(400).send({status: false, msg: "This Mobile number is already registered .Enter a new mobile number"});
    }
    //--------------------[checking for the college document in the DB]--------------------------------------
    
    let getCollege = await collegeModel.findOne({name: collegeName});
    if(!getCollege){
        return res.status(400).send({status: false, msg: "No college is listed with that College name"});
    }
   
    let result = {
      name: name,
      email: email,
      mobile: mobile,
      collegeId: getCollege._id
    }

    let internData = await internModel.create(result);
    let updateData = await internModel.find(internData).select({name:1,email:1,mobile:1,collegeId:1})
    res.status(201).send({status: true, msg: "Intern Created successfully", document: updateData});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = {createIntern};