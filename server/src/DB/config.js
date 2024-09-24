const mongoose = require('mongoose');

//const MONGO_URI = 'mongodb+srv://admin123:root123@atlascluster.se9lvuh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster'


const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: 'netflix-clone-db' 
    });
    const connection = mongoose.connection;
    connection.on("connected", () => {
        console.log("Connection is successful");
    });
    connection.on("error", (error) => {
        console.log("Error in connection", error);
    });
};

module.exports = connectDB;
