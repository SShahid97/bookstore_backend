const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
// import routes
const authRoute = require("./routes/auth");
const bookRoute = require("./routes/books");
const cartRoute = require("./routes/cart");
const uploadRoute = require("./routes/upload");
const reviewRoute = require("./routes/reviews");
//import db connection file
require("./db/connection");

const app = express();
app.use(cors());

//all routes are kept inside router file (namely :./routes/books.js)
const port = process.env.PORT || 5000;

//Middleware
// Allows to access json format data sent from client
app.use(express.json());

// Routes middleware
app.use("/api/books",bookRoute);
app.use("/api/cart", cartRoute);
app.use("/api/user",authRoute);
app.use("/api/upload",uploadRoute);
app.use("/api/reviews",reviewRoute);



app.listen(port,()=>{
    console.log(`Server listening at port: ${port}`);
});

