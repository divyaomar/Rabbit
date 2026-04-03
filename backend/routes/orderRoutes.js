const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//our first request will be to get all the orders for the logged in users
//@route GET /api/orders/my-orders
//@desc get all the orders for the logged in users
// @access will be private
router.get("/my-orders", protect, async (req, res) => {
    try {
        //find orders for the authenticated user
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // sort by createdAt shown most recent order first
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})
        
    }
});

//@route GET /api/orders/:id
//@desc Get order details by id
//@access private
router.get("/:id", protect, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user",
            "name email"
        );
        if(!order){
            return res.status(404).json({
                message:"Order not found"
            })
        }
        //return the full orde5r details
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"})
        
    }
});
module.exports = router;
//api secret -wWlOS5n1iUU4wcnrbX6b47-Ss0
//api key 355497936531587
// key name   mediaflows_22cb693b-b2a0-4468-9d2e-45d28a2e1b46
//cloud name Cloud name: dvo2ll9bk
// CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dvo2ll9bk