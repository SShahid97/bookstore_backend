const express = require("express");
const router = new express.Router();
const Stock = require("../models/Stock");
const verify = require("./verifyToken");

//Handling GET Request for individual based on book id
router.get("/:_id", async (req, res) => {
    try {
        const _id = req.params._id;
        // console.log(_id)
        const stockDetails = await Stock.find({book_id:_id});
        if(stockDetails){
            let stock = stockDetails[0];
            res.send(stock);
        }else{
            res.send("No stock found");
        }
        
    } catch (err) {
        res.status(400).send(err);
    }

});

module.exports = router;