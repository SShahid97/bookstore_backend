const express = require("express");
const router = new express.Router();
const Address = require("../models/Address");
const verify = require("./verifyToken");

//Handling POST Request
router.post("/",verify, async (req, res) => {
    const addressCollection = new Address(
        {
           user_id: req.body.user_id,
           contact:req.body.contact,
           country:req.body.country,
           state:req.body.state,
           city:req.body.city,
           pincode:req.body.pincode,
           address:req.body.address
        });
    try {
        console.log(addressCollection);
        const insertedAddress = await addressCollection.save();
        res.status(201).send(insertedAddress);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Handling GET Request for individual based on id
router.get("/:_id",verify, async (req, res) => {
    try {
        const _id = req.params._id;
        const returnedAddress = await Address.find({user_id:_id});
        if(returnedAddress){
            res.send(returnedAddress);
        }else{
            res.send("No Address found");
        }
        
    } catch (err) {
        res.status(400).send(err);
    }

});


module.exports = router;