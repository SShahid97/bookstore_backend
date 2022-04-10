const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({    
    book_code:{ 
        type:String,
        required:true
        // unique:true
    },
    book_name:{
        type:String,
        required:true
    }, 
    book_author: {
        type:String,
        required:true
    },
    book_image: {
        type:String,
        required:true
    },
    price: {
        type: Number,
        required:true
    },
    category: {
        type: String,
        required:true
    },
    book_description:{
        type: String,
        required:true
    }
});


// Creating Collection 
const Books = new mongoose.model("Books",bookSchema);
module.exports = Books;