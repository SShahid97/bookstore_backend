const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({    
    book_id:{ 
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    review: {
        type: String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});


// Creating Collection 
const Reviews = new mongoose.model("Reviews",reviewSchema);
module.exports = Reviews;