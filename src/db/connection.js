const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/bookStore")
// mongoose.connect("mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.ch92f.mongodb.net/bookStore?retryWrites=true&w=majority/bookStore")
// mongoose.connect(`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.ch92f.mongodb.net/bookStore`)
.then(()=>{
    console.log("Connection to MongoDB Successful");
}).catch((err)=>{
    console.log("Connection failed: ",err);
});