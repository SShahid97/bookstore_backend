const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    book_id:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }  
});

module.exports = mongoose.model('Cart',cartSchema);