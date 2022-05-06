const express = require("express");
const router = new express.Router();
const Pincode = require("../models/Pincode");
const verify = require("./verifyToken");


router.get("/:pincode", async (req, res) => {
    let pincode = req.params.pincode;
    try {
        const pincodeDetails = await Pincode.find({pincode:pincode});
        res.status(200).send(pincodeDetails);
    } catch (err) {
        res.status(400).send(err);
    }
});
//Handling POST Request
// router.post("/", async (req, res) => {
//     // console.log(req.body);
//     const orderCollection = new Order(
//         {
//            user_id: req.body.user_id,
//            total_amount:req.body.total_amount,
//            shipping_charges:req.body.shipping_charges,
//            order:req.body.order
//         });
//         // console.log(orderCollection);
//     try {
//         const insertedOrder= await orderCollection.save();
//         res.status(201).send(insertedOrder);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });
router.get("/", async (req, res) => {
    // console.log(req.body);
    try {
        const pincodes = await Pincode.find({});
        res.status(200).send(pincodes);
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;