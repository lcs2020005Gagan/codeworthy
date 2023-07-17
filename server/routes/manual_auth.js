const express = require("express")
const bodyParser = require("body-parser");
const User = require("../models/Users")
const router = express.Router()
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
const secretKey = "helloworld"
var jwt = require("jsonwebtoken");


//create user
router.post('/createuser',
    [body('name', 'Enter a valid name').isLength({ min: 1 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
    body('profileImg', 'proper image').isLength({ min: 1 }),
    ],
    async (req, res) => {
        success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, errors: "Email is alerady registered" });
            }
            else {
                var salt = await bcrypt.genSaltSync(10);
                var secpassword = await bcrypt.hashSync(req.body.password, salt);
                user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: secpassword,
                    profileImg:req.body.profileImg
                })
                console.log("user ", user)
                var authtoken = await jwt.sign({ id: user.id }, secretKey)
                console.log(authtoken);
                success = true
                res.json({ success, authtoken,user });
                success = false;
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Some error occured");
        }
        res.send("hello");
    }
);

//store the just logged in google user in the database.
router.post('/creategoogleuser',
    [body('name', 'Enter a valid name').isLength({ min: 1 }),
    body('email', 'Enter a valid email').isEmail(),
    body('profileImg', 'proper image').isLength({ min: 1 }),
    ],
    async (req, res) => {
        success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, errors: "Email is alerady registered" });
            }
            else {
                const secpassword="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjUzNjg4ZTU4NThhNTkyNjA4MzFkNCIsImlhdCI6MTY4OTU5NzgxMn"
                user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: secpassword,
                    profileImg:req.body.profileImg
                })
                var authtoken = await jwt.sign({ id: user.id }, secretKey)
                success = true
                res.json({ success, authtoken, user });
                success = false;
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Some error occured");
        }
    }
);


//login user
router.post('/loginuser',
[ body('email','Enter a valid email').isEmail(),
  body('password','password must be atleast 5 characters').isLength({ min: 5 }),
],
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try{
        let user= await User.findOne({email:req.body.email});
        if(!user)
        {
            return res.status(400).json({ success,errors: "wrong email" });
        }
        else{
           var passwordcompare=await bcrypt.compare(req.body.password,user.password)
           if(!passwordcompare)
           {
            return res.status(400).json({success, errors: "wrong passwrod" });
           }

        var authtoken=await jwt.sign({id:user.id},secretKey)
        success=true;
        res.json({success,authtoken,user});
        success=false;  
    }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Some error occured");
    }
  }
)

//get the auth token for the logged in google user.
router.post('/logingoogleuser',
[ body('email','Enter a valid email').isEmail(),
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try{
        let user= await User.findOne({email:req.body.email});
        if(!user)
        {
            return res.status(400).json({ success,errors: "wrong email" });
        }
        else{
        var authtoken=await jwt.sign({id:user.id},secretKey)
        success=true;
        res.json({success,authtoken,user});
        success=false;  
    }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Some error occured");
    }
  }
)


module.exports=router
