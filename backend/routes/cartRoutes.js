const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by user Id or guest Id
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    } else if (guestId) {
        return await Cart.findOne({ guestId })
    }
    return null;
}

// @route Post /api/cart
// @desc Add a product to the cart for a guest or logged in user.
// @access Public

router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    console.log("ProductId from frontend:", productId);
    try {
        const product = await Product.findById(productId);
        console.log("Product from DB:", product);
        if (!product) return res.status(404).json({ message: "product not found" })
        // determine if the user is logged in or guest
        let cart = await getCart(userId, guestId);

        // if the cart exists, update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // If the product already exists, update the quatity
                cart.products[productIndex].quantity += quantity;
            } else {
                // add new products
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                })
            }

            // Recalculate the total price
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // ?create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,

                    },
                ],
                totalPrice: product.price * quantity,
            })
            return res.status(201).json(newCart)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "SERVER ERROR"
        })

    }
})


// @route PUT /api/cart
//@desc update product quantity in the cart for a guest or logged-in user
// @access will be public
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart ot Found." })
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
        if (productIndex > -1) {
            // update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);// remove the prove if quantity is zero
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({
                message: "PRODUCT NOT FOUND"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "SERVER ERROR"
        })

    }
})
// @route DELETE /api/cart
// Goal: remove product from the cart.
// @access public

// Steps: Find Cart
// take all inputs
// we will find cart with the help of getCart function
// now I have to find product index to delete 
// after getting productIndex, if it is greater than -1, then delete it
//update totalprice
//save the cart

router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    console.log(userId, "data")
    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart Not Found." });

        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product NOt found in the cart" })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error"
        })

    }

});

// @route GET /api/cart // displaying the cart
// @desc GET logged-in user's or guest
// access will be public

router.get("/", async (req, res) => {
    // get the userId
    const { userId, guestId } = req.query;
    console.log(userId, guestId);
    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({
                message: "CART NOT FOUND"
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "SERVER ERROR"
        })


    }
})
// @route POST /api/cart/merge
// @desc Merge guest cart ito user cart o login
// @access private
// for understanding this route logic, guest user added two products without logged in. After adding he logged in.
// what to do to system is that I have to put all the guest items from the cart to the user cart. 
// we will take the temporary guest id from the request body.
//then we find guestcart and usercart in database 
//

router.post("/merge", protect, async (req, res) => {

    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest Cart Is Empty." })
            }

            if (userCart) {
                //Merge guest cart ito user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) => item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color);

                    if (productIndex > -1) {
                        //if the items exists in the user cart, update the quatity
                        userCart.products[productIndex].quantity += guestItem.quantity;

                    } else {
                        //otherwise, add the guest item to the cart
                        userCart.products.push(guestItem);
                    }
                });
                userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
                await userCart.save();


                // remove the guestCart after merging
                try {
                    await Cart.findOneAndDelete({ guestId })
                } catch (error) {
                    console.error("Error deletig guest Cart", error);

                }
                res.status(200).json(userCart)
            } else {
                //if the user has no existing cart, assign the guest cart tot he user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                //guest cart has already been merged, return user cart
                return res.status(200).json(userCart);
            }
            res.status(404).json({
                message: "Guest Cart No Found."
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        })

    }
})
module.exports = router;