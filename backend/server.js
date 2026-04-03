const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv")


dotenv.config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const subscriberRoute = require("./routes/subscriberRoute")
const adminRoutes = require("./routes/adminRoutes")
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");


const app = express();
app.use(express.json());
app.use(cors());



const PORT = process.env.PORT || 3000;
// Connect to MONGODB database
connectDB();
mongoose.connection.once("open", () => {
    console.log("Connected DB:", mongoose.connection.name);
});

app.get("/", (req, res) => {
    res.send("Welcome to the Ecommerce API.")
})

// API routes will be here
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api", subscriberRoute)

//Admin Route
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes)
app.use("/api/admin/orders", adminOrderRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})