const express = require("express")
const bodyParser = require("body-parser");
const User = require("../models/Users")
const Question = require("../models/Questions")
let fetchuser=require("../middleware/fetchuser")
const router = express.Router()
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');


//add a question to saved questions list
router.post('/savequestion/:question_id', fetchuser, [], async (req, res) => {
     try {
         const question = req.params.question_id;
        await User.findOneAndUpdate({
           _id:req.id
         },{
           $push:{
             savedQuestions:question
           }
         })
        const user=await User.find({_id:req.id});
         res.json({"message":"question added to list","user":user});
        } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal Server Error");
     }
 })

//delete a question from saved list
router.post('/removesavedquestion/:question_id', fetchuser, [
], async (req, res) => {
     try {
         const question_id = req.params.question_id;
        await User.findOneAndUpdate({
           _id:req.id
         },{
           $pull:{
             savedQuestions:question_id
           }
         })
        const user=await User.find({_id:req.id});
         res.json({"message":"question deleted successfully","user":user});
     } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal Server Error");
     }
 })

//mark a question as done
router.post('/markquestion/:question_id', fetchuser, [], async (req, res) => {
    try {
        const question = req.params.question_id;
       await User.findOneAndUpdate({
          _id:req.id
        },{
          $push:{
            solvedQuestions:question
          }
        })
       const user=await User.find({_id:req.id});
        res.json({"message":"question marked as done","user":user});
       } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//delete a question from saved list
router.post('/unmarkquestion/:question_id', fetchuser, [
], async (req, res) => {
    try {
        const question_id = req.params.question_id;
       await User.findOneAndUpdate({
          _id:req.id
        },{
          $pull:{
            solvedQuestions:question_id
          }
        })
       const user=await User.find({_id:req.id});
        res.json({"message":"question unmarked as done","user":user});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports=router
