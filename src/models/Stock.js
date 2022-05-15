const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    book_code:{
        type:String,
        required:true,
        unique:true
    },
    total_count:{
        type:Number,
        required:true
    },
    count_in_stock:{
        type:Number,
        required:true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Stock',stockSchema);