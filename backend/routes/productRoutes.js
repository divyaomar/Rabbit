const express = require("express");
const Product = require("../models/Product");
// we'll also require middleware for the authorization and authentication.
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router();

// @route POST /api/products
// @description Create a new Product
// @access Private/Admin

router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;
        const product = new Product({
            name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku,
            user: req.user._id // Reference to the admin user who created it
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);


    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
})


// @route PUT /api/products/:id
//@desc Update an existing  product ID
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;
        //  we need to product by ID provided in URL
        const product = await Product.findById(req.params.id);
        if (product) {
            // update product details
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.sku = sku || product.sku;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;

            // save the updated product to the databases
            const updatedProduct = await product.save();
            res.json(updatedProduct)

        } else {
            res.status(404).json({
                message: "Product Not Found."
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })

    }
})
// @route DELTE /api/products/:id
// @desc DELETE a product by a ID 
// @access Privat/admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (product) {
            // remove the product from DB
            await product.deleteOne();
            res.json({
                message: "Product removed"
            })
        } else {
            res.status(404).json({
                message: "Product Not Found."
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")

    }
})
// @route GET /api/products
// @description GET all products with optimal query filters
// @access this will be public
router.get("/", async (req, res) => {
    try {
        const { collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit } = req.query;

        let query = {};

        // Filter Logic
        if (collection && collection.toLocaleLowerCase() !== "all") {
            query.collections = collection;
        }

        if (category && category.toLocaleLowerCase() !== "all") {
            query.category = category;
        }
        if (material) {
            query.material = { $in: material.split(",") };
        }
        if (brand) {
            query.brand = { $in: brand.split(",") };
        }
        if (size) {
            query.sizes = { $in: size.split(",") };
        }
        if (color) {
            query.colors = { $in: [color] };
        }
        if (gender) {
            query.gender = gender;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        }

        // sort Logic
        let sort={};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = {price:-1};
                    break;
                case "popularity":
                    sort = {rating:-1};
                    break;
                default:
                    break;
            }
        }
        // fetch product from the dataase
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products)
    } catch (error) {
console.log(error);
res.status(500).send("Server Error.")
    }
})

// @route GET /api/products/best-seller
//@desc retrieve the product with highest rating
//@access Public
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if(bestSeller) {
            res.json(bestSeller)
        } else{
            res.status(404).json({
                message:"No best Seller Found"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
        
        
    }
})

// @route GEt api/products/new-arrivals
// @desc Retreive latest 8 products - Creatio date
// @access Public
router.get("/new-arrivals", async (req, res) => {
    try {
        // fetch latest 8 products
        const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);
        res.json(newArrivals);
        console.log(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"SERVER ERROR. KINDLY CHECK."})
        
    }
})


//@route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            res.json(product);
        } else {
            res.status(404).json({
                message:"Product Not Found."
            })
        }
    } catch (error) {
       console.error(error);
        res.status(500).send("Server Error.")
        
    }
})



// @route GET /api/products/similar/:id
// @desc Retreive similar products based on thr current products geder and cartegory
//@access Public
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log(id);
        const product = await Product.findById(id);
        if(!product) {
            return res.status(404).json({message:"Product not found."})
        }
        const similarProducts = await Product.find({
            _id:{$ne: id}, //exclude the current product ID
            gender:product.gender,
            category:product.category,

        }).limit(4);
        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send("server error")
        
    }
});

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk4NDg3ZTVlMzIxNDZkYjY1MjYyMDE5Iiwicm9sZSI6ImN1c3RvbWVyIn0sImlhdCI6MTc3MDI5MzIzNywiZXhwIjoxNzcwNDM3MjM3fQ.90ThrGO0yXP2IlE1F3a1-OsQrDWbNpXT6RDBeb99nOs