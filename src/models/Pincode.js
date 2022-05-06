const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    shipping_charges:{
        type:Number,
        required:true
    } 
});

module.exports = mongoose.model('Pincode',pincodeSchema);