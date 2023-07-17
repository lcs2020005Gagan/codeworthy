const express = require("express")
const bodyParser = require("body-parser");
const User = require("../models/Users")
const Question = require("../models/Questions")
const router = express.Router()
let fetchuser=require("../middleware/fetchuser")
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');


//get all questions
router.get('/getallquestions',async(req, res) => {
    const questions=await Question.find({});
   res.json(questions);
  });

  //get user's saved questions
router.get('/getsavedquestions',fetchuser,
  async (req, res) => {
    console.log(req.id);
    await User.find({_id:req.id})
  .select("savedQuestions")
  .populate("savedQuestions")
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });



module.exports=router
