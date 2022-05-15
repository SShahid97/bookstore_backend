const express = require("express");
const router = new express.Router();
const Stock = require("../models/Stock");
const verify = require("./verifyToken");

//Handling POST Request
router.post("/",verify, async (req, res) => {
    // console.log(req.body);
    const stockCollection = new Stock(
        { 
           book_code:req.body.book_code,
           total_count:req.body.total_count,
           count_in_stock:req.body.count_in_stock
        });
        // console.log(stockCollection);
    try {
        const insertedStock = await stockCollection.save();
        if(insertedStock){
            res.status(201).send(insertedStock);
        }
    } catch (err) {
        if(err.errors){
            res.status(400).send(err);
        }else{
            res.status(422).send({message:"Book Code Must be Unique"});
        }
    }
});

//Handling GET Request for individual based on book id
router.get("/:code", async (req, res) => {
    try {
        const code = req.params.code;
        const stockDetails = await Stock.find({book_code:code});
        if(stockDetails.length>0){
            let stock = stockDetails[0];
            res.send(stock);
        }else{
            res.status(204).send();
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

// Handling UPDATE (PATCH, put) Request for individual record
router.patch("/:_id",verify,async (req,res)=>{
    try{
        const _id = req.params._id
        const updatedStock = await Stock.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        res.send(updatedStock);
    }catch(err){
        res.status(400).send(err);
    }
});
module.exports = router;