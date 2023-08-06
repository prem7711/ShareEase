require('dotenv').config();

const mongoose=require("mongoose");
// const connection=mongoose.connection;

// rmSBwluTm4W02YU2
//mongodb://atlas-sql-6488a4284b21d151a32340aa-dlhxx.a.query.mongodb.net/filesharing?ssl=true&authSource=admin
function connectDB(){
    //database connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true},6000000)
   .then('open',()=>{
        console.log("database connected")
    }).catch(err =>{
        console.log("connection failed");
    })
}


module.exports=connectDB;