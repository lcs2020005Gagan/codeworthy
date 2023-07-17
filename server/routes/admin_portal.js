const express = require("express")
const bodyParser = require("body-parser");
const User = require("../models/Users")
const Question = require("../models/Questions")
const router = express.Router()
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');


//add a question
  router.post('/addquestion', [
    body('title', 'Enter a valid title').isLength({ min: 1}),
    body('description').isLength({min:1}),
    body('tags'),
    body('difficulty'),
    body('link')
   ], async (req, res) => {
        try {
            const { title, description,tags,difficulty,link } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const question = new Question({
                title, description,tags,difficulty,link
                })
            const savedQuestion = await question.save()
            res.send({success:"success",question:savedQuestion});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//delete a question
   router.delete('/deletequestion/:id', async (req, res) => {
    try {
        let question =await Question.findById({_id:req.params.id});
        if(!question)
        {
            res.status(498).send("question not found");
        }
        question=await Question.findByIdAndDelete(req.params.id);
        res.json({"success":"Note was successfully deleted",question:question});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports=router
