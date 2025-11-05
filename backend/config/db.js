const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        const connextion = await mongoose.connect(process.env.MONGO_URI);
        console.log("mangu tai connected....");
    }
    catch(err){
        console.error(`ERROR: ${err.message}`);
        process.exit(1)
    }
};

module.exports = connectDB;