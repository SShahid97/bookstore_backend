const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    book_id:{
        type:String,
        required:true
    },
    book_code:{
        type:String,
        required:true
    },
    total_count:{
        type:Number,
        required:true
    },
    count_in_stock:{
        type:Number,
        required:true
    }
     
});

module.exports = mongoose.model('Stock',stockSchema);