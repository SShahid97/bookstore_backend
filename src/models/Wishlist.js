const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    book_id:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }  
});

module.exports = mongoose.model('Wishlist',wishlistSchema);