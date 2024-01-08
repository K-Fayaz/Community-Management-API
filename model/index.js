const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then((data)=>{
        console.log("connected to the database");
    })
    .catch((err)=>{
        console.log(err);
    })
    