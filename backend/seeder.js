const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require('./models/User');
const products = require("./data/products");
const Cart = require("./models/Cart");

dotenv.config();

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once("open", () => {
    console.log("Seed Connected DB:", mongoose.connection.name);
});

// Function to seed the data
const seedData = async () => {
    try {
        //Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // create a default admin User
        const createdUser = await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123456",
            role:"admin"
        });

        // Assign the default user ID to each product
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return {...product, user:userID};
        })
// Insert the products into the database
await Product.insertMany(sampleProducts);
console.log("Product data seeded successfully!");

    } catch (error) {
        console.log(error)
        console.error("Error in seeding data");
        process.exit(1);
    }
};
seedData();