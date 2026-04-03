const express = require("express");
const User = require("../models/User");
const {protect, admin} = require("../middleware/authMiddleware");

//initilize a router
const router = express.Router();

//let's create a route to list all users
//@route GET /api/admin/users
//@desc Get all users
//@access private
router.get("/", protect, admin, async (req, res) => {

try {
    //fetch all the users from db
    const users = await User.find({})
    res.json(users)
} catch (error) {
    console.error(error);
    res.status(500).json({message:"server error"})
    
}

} );
// @route POST /api/admin/users
// @desc Add a new user (admin only)
//@access private/admin
router.post("/", protect, admin, async(req, res) => {
const {name, email, password, role}= req.body;
try {
    let user = await User.findOne({email})
    if(user){
        return res.status(400).json({message:"User alreadu exists"})
    }
    user = new User({
        name,
        email,
        password,
        role:role || "customer",
    });
    await user.save();
    res.status(201).json({message:"User created successfully"})
} catch (error) {
    console.error(error);
    res.status(500).json({message:"Server error"})
    
}

});
//route PUT /pi/admin/users/:id
// @desc update user info (admin only) - Name, email, role
// access Private/admin
router.put("/:id", protect, admin, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
}

        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role; 
        }
        const updateUser = await user.save();
res.json({
    message:"User updated successfully.", user: updateUser
})
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Server Error"
        })
        
    }
});
// route delete /api/admin/users
//@desc delete the users
//access private/admin
router.delete("/:id", protect, admin, async(req, res) => {

try {
    const user = await User.findById(req.params.id);
    if(user){
        await user.deleteOne()
        res.json({
            message:"User deleted successfully."
        })
    } else{
        res.status(404).json({
            message:"user not found."
        })
    }
} catch (error) {
    console.error(error);
    res.status(500).json({
        message:"server error"
    })
    
}

})

module.exports = router;