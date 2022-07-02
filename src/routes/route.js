const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController");
const internController = require("../controllers/internController");

router.post("/functionup/colleges", collegeController.createCollege);       //create college document
router.post("/functionup/interns", internController.createIntern);          //create intern document
router.get("/functionup/collegeDetails", collegeController.collegeDetails); //get college document along with the intern's details

module.exports = router;


//Amazon s3 Link    https://functionup-stg.s3.ap-south-1.amazonaws.com/thorium/_____.png|jpeg|jpg
//aasc.jpg