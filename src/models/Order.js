const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    total_amount:{
        type:Number,
        required:true
    },
    shipping_charges:{
        type:Number,
        required:true
    },
    payment_status:{
        type:String,
        required:true
    },
    payment_method:{
        type:String,
        required:true
    },
    delivery_status:{
        type:String,
        required:true
    },
    order:[
        {
            book_id:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            discount:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ],
    date:{
        type:Date,
        default:Date.now
    }  
});

module.exports = mongoose.model('Order',orderSchema);