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
        // console.log(addressCollection);
        const insertedAddress = await addressCollection.save();
        if(insertedAddress){
            res.status(201).send(insertedAddress);
        }else{
            res.status(204).send();
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

//Handling GET Request for individual based on id
router.get("/:_id",verify,async (req, res) => {
    try {
        const _id = req.params._id;
        const returnedAddress = await Address.find({user_id:_id});
        if(returnedAddress.length > 0){
            res.send(returnedAddress[0]);
        }else{
            res.status(204).send();
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});

//Deleting Address
router.delete("/:_id",verify, async (req, res) => {
    try {
        const _id = req.params._id;
        const deleteAddress = await Address.findByIdAndDelete(_id);
        if(deleteAddress){
            res.send({message:"Address Deleted Successfully"});
        }else{
            res.status(204).send();
        }
        
    } catch (err) {
        res.status(400).send(err);
    }

});

//Update Address
router.patch("/:_id",verify, async (req, res) => {
    try {
        const _id = req.params._id;
        const updatedAddress = await Address.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        if(updatedAddress){
            res.send({message:"Address Updated Successfully"});
        }else{
            res.status(204).send();
        }
        
    } catch (err) {
        res.status(400).send(err);
    }

});


module.exports = router;