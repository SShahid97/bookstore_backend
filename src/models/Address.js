const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }  
});

module.exports = mongoose.model('Address',addressSchema);