const express = require("express");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();

// first route will be for user registration
// POST request
// /api/users/register
// @desc Register a new user, @access Public

router.post("/register", async (req, res) => {
    const {name, email, password, role} = req.body;
    try {
        // here will be registration Logic
        let user = await User.findOne({email});
        if(user) return res.status(400).json({message:"User Already Exists."});
            user = new User ({name, email, password, role: role === "admin" ? "admin" : "customer"});
        await user.save();
        // create json web token
        const payload = {user:{id:user._id, role:user.role}};
        // sign and return the token with data
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"40h"}, (err, token)=>{
            if(err) throw err;   
            // send the user and token in response
            res.status(201).json({
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                token,
            })
        }
    );

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
});

// later we'll look at how to make use of this token to authorize
// @route POST /api/users/login
// @description Authenticate user
// @access will be public
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

try {
    console.log(req.body);
    // find the user by email
    let user = await User.findOne({email});

    // check user is present or not.
    if(!user) return res.status(400).json({message:"Invalid Credential."});

    // we also need to match the password.
    const isMatch = await user.matchPassword(password);

    if(!isMatch) 
        return res.status(400).json({message: "Invalid Credentials"});

     const payload = {user:{id:user._id, role:user.role}};
        // sign and return the token with data
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"40h"}, (err, token)=>{
            if(err) throw err;   
            // send the user and token in response
            res.json({
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                token,
            })
        }
    );


} catch (error) {
    console.log(error);
    res.status(500).send("Server Error")
}


});


// route GET /api/users/profile
// @description GET logged in users profile
// @access  will be private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
})

module.exports = router;
