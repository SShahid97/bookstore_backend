const express = require("express");
const router = new express.Router();
const Order = require("../models/Order");
const Book = require("../models/book");
const verify = require("./verifyToken");

//Handling POST Request
router.post("/",verify, async (req, res) => {
    // console.log(req.body);
    const orderCollection = new Order(
        {
           user_id: req.body.user_id,
           total_amount:req.body.total_amount,
           shipping_charges:req.body.shipping_charges,
           payment_status:req.body.payment_status,
           payment_method:req.body.payment_method,
           order:req.body.order
        });
        // console.log(orderCollection);
    try {
        const insertedOrder = await orderCollection.save();
        res.status(201).send(insertedOrder);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Handling GET Request for individual based on user id
router.get("/search",verify, async (req, res) => {
    try {
        const userId = req.query.user_id;
        console.log(userId);
        const returnedOrders = await Order.find({user_id:userId});
        // console.log(returnedOrders);
        if(returnedOrders.length>0){
            let  book_ids = [];
            for(let i=0; i<returnedOrders.length; i++){
                let indecies=[];
                returnedOrders[i].order.forEach((bookInfo)=>{
                    indecies.push(bookInfo.book_id);
                })
                book_ids.push(indecies);
            }
            // console.log(book_ids);

            let books=[];
            for(let i=0; i<book_ids.length; i++){
                    let ids = book_ids[i];
                let book = await Book.find({ _id: { $in: ids }});
                books.push(book); 
            }
            // console.log("Books ", books);
            
            for(let i=0; i<returnedOrders.length; i++){
                returnedOrders[i].order.forEach((bookInfo,index)=>{
                    // console.log(bookInfo);
                    // adding book in place of book_id
                    bookInfo.set( "book",books[i][index], { strict: false });
                    
                    // Deleting book_id and id
                    bookInfo.set('book_id', undefined, {strict: false});
                })
            }
            res.send(returnedOrders);
        }else{
            res.status(204).send();
        }
    } catch (err) {
        res.status(400).send(err);
    }

});

// handling search keyword (Order Id)
router.get("/:_id",async(req, res)=>{
    try{
        const OrderId = req.params._id;
        const returnedOrder = await Order.findById(OrderId);
        if(returnedOrder !== null){
            let  book_ids = [];
            returnedOrder.order.forEach((bookInfo)=>{
                book_ids.push(bookInfo.book_id);
            });

            let books = await Book.find({ _id: { $in: book_ids }});

            returnedOrder.order.forEach((bookInfo,index)=>{
                // adding book in place of book_id
                bookInfo.set( "book",books[index], { strict: false });
                
                // Deleting book_id and id
                bookInfo.set('book_id', undefined, {strict: false});
            });
            res.send(returnedOrder);
        }else{
            res.status(204).send();
        }
    }catch(err){
        res.status(400).send(err);
    }
})


module.exports = router;