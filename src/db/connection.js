const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/bookStore")
.then(()=>{
    console.log("Connection to MongoDB Successful");
}).catch((err)=>{
    console.log("Connection failed: ",err);
});