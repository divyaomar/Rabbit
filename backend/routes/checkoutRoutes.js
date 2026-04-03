 const express = require("express");
 const Checkout = require("../models/Checkout");
 const Cart = require("../models/Cart");
 const Product = require("../models/Product");
 const Order = require("../models/Order");
 const {protect} = require("../middleware/authMiddleware");

 const router = express.Router();


// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private

router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;


    if(!checkoutItems || checkoutItems.length === 0){
        return res.status(400).json({
            message:"No Item will checkout"
        });
    }

    try {
        // create a new checkout session
        const newCheckout = await Checkout.create({
         user: req.user._id,
         checkoutItems: checkoutItems,
         shippingAddress,
         paymentMethod,
         totalPrice,
         paymentStatus:"Pending",
         isPaid: false



        });
        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Error creating checkout sessions");
        res.status(500).json({
            message:"Server Error"
        })
        
    }
});
// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successfull payment
// access will be private

router.put('/:id/pay', protect, async (req, res) => {

    const {paymentStatus, paymentDetails} = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            return res.status(404).json({message:"Checkout not found."});
        }
// we'll also paymentStaus is paid
if(paymentStatus === "paid"){
    checkout.isPaid = true;
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails;
    checkout.paidAt = Date.now();

    await checkout.save();
    res.status(200).json(checkout);

} else {
    // if paymentSTtaus isn't paid
    res.status(400).json({message:"Invalid payment status"})
}

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Server Error"
        });
        
    }
});

// @route POST /api/checkout/:id/finalize
// @desc finalize checkout and convert to an order after payment confirmation
// @access private
router.post("/:id/finalize", protect,async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            return res.status(404).json({message:"Checkout not found."});
        }

        if(checkout.isPaid && !checkout.isFinalized){
            //create the final order based on the checkout details
            const finalOrder = await Order.create({
                user: req.user._id,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                paymentDetails: checkout.paymentDetails,
                userInfo: {           
        name: req.user.name,
        email: req.user.email
    }
            });
            // Mark the checkout as finalize 
checkout.isFinalized = true;
checkout.finalizedAt = Date.now();
await checkout.save();
// delete the cart associated with the user
await Cart.findOneAndDelete({ user: checkout.user });
res.status(201).json(finalOrder);
        } else if(checkout.isFinalized) {
res.status(400).json({message:"Checkout already finalized"})
        } else{
            res.status(400).json({message:"Checkout is not Paid"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})
        
    }
});
module.exports = router;