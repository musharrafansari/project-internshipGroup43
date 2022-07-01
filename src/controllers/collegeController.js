const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const { default: mongoose } = require("mongoose");

//----------------------------------[Create College]----------------------------------------------

const createCollege = async function (req, res) {
    try {
        let data = req.body;
        let { name, fullName, logoLink } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Data is required" });
        }
        //---------------[checking whether all the required inputs are given or not]-------------------
        if (!name) {
            return res.status(400).send({ status: false, msg: "Name field is missing" });
        }
        if (!fullName) {
            return res.status(400).send({ status: false, msg: "Full Name field is missing" });
        }
        if (!logoLink) {
            return res.status(400).send({ status: false, msg: "Logo Link field is missing" });
        }
        //------------------------------[checking the Validation of the inputs]-------------------------------------

        if (name.trim().length !== 0) {
            if (!/^[a-zA-Z]+(-[a-zA-Z]+)?$/.test(name)) {
                return res.status(400).send({ status: false, msg: "Enter valid name" });
            }
        }
        else{
            return res.status(400).send({ status: false, msg: " Opps! invalid  name" });
        }

        if (fullName.trim().length !== 0) {
            if (!/^[a-zA-Z_ ,]+$/.test(fullName)) {
                return res.status(400).send({ status: false, msg: "Enter valid Full name" });
            }
        } else
            return res.status(400).send({ status: false, msg: "  Opps! invalid Full name" });

        if (!/(http|https(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/.test(logoLink)) {
            return res.status(400).send({ status: false, msg: "Enter a valid logolink" });
        }
        // ---------[Checking whether unique attributes are present in the DB or not]---------------------------------

        let getCollegeName = await collegeModel.findOne({ name });
        if (getCollegeName) {
            res.status(400).send({status: false,msg: `${name} is already listed`});
        }
        //-------------------------[creating college document with the given inputs]--------------------------------------

        let collegeData = await collegeModel.create(data);
        res.status(201).send({ status: true, data: collegeData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const collegeDetails = async function (req, res) {
    let queryData = req.query;
    //------------------------------[checking whether the required input is given or not]-------------------------------

    if (Object.keys(queryData).length == 0) {
        return res.status(400).send({status: false, message: "Please include some request in filter"});
    }

    let collegeName = req.query.collegeName;

    if (Object.keys(queryData).length > 1) {
        return res.status(400).send({status: false, message: "Please include college name key only"});
    }
    if (!collegeName) {
        return res.status(400).send({status: false, message: "Please provide college name Key 🔴"});
    }
    if (collegeName.trim().length == 0) {
        {
            return res.status(400).send({status: false, message: "collegeName can't be empty space"});
        }
    }

    //---------------------------[finding the college document with the college name]---------------------------------

    let collegeDetails = await collegeModel.findOne({ name: collegeName });

    if (!collegeDetails) {
        return res.status(400).send({ status: false, msg: "College is not listed" });
    }
    //-----------------------------finding the intern document with the college document id]-----------------------------------------

    let internDetails = await internModel.find({ collegeId: collegeDetails._id }).select({ name: 1, email: 1, mobile: 1, _id: 1 });
    if (internDetails.length == 0) {
        return res.status(400).send({status: false, msg: "No intern has applied for this college"});
    }

    let result = {
        name: collegeDetails.name,
        fullName: collegeDetails.fullName,
        logoLink: collegeDetails.logoLink,
        interns: internDetails,
    };
    res.status(200).send({ status: true, data: result });
};

module.exports = { createCollege, collegeDetails };