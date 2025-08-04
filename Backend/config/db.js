const mongose = require('mongose');
require('dotenv').config;
const connectDB = async ()=>{
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log("messege",error);
    }
}
module.exports = mongose;