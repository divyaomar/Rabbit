const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB connected Successfully,")
    } catch (error) {
        console.log("MONGODB Connection failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;