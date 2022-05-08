const express = require("express");
const router = new express.Router();
const Cart = require("../models/Cart.js");
const Book = require("../models/book");
const verify = require("./verifyToken");


// handles inserting a cart item
router.post("/", async (req, res) => {
        const cartCollection = new Cart(
            {
                user_id: req.body.user_id,
                book_id: req.body.book_id,
                price: req.body.price,
                quantity: req.body.quantity,
            });
        try {
            const insertedCartItem = await cartCollection.save();
            res.status(201).send(insertedCartItem);
        } catch (err) {
            res.status(400).send(err);
        }

});

//Handling GET Request for individual based on id
router.get("/:_id", verify, async (req, res) => {
    try {
        const book_ids=[];
        const _id = req.params._id;
        const CartItems = await Cart.find({ user_id: _id });
        if(CartItems.length>0){
            // pushing ids of books for a specific user from cart collection into an array
            CartItems.forEach((item)=>{
                book_ids.push(item.book_id);
            });

            // getting books from the book collection based on the books id array
            const books = await Book.find({ _id: { $in: book_ids }});

            // adding the returned book items to each object in cart response  
            CartItems.forEach((item)=>{
                for(let i=0; i<books.length; i++){
                    if(String(item.book_id) == String(books[i]._id)){
                        // adds a new key value pair (book:{}) to the CartItems object
                        item.set( "book",books[i], { strict: false });

                        // deletes "book_id" key from the CartItems object
                        item.set('book_id', undefined, {strict: false});
                        break;
                    }
                }
            })
            res.send(CartItems);
        }else{
            res.status(204).send();
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});


router.delete("/whole/:userID", async(req, res)=>{
    try{
        const userID =  req.params.userID;
        const deletedCart = await Cart.deleteMany( { user_id : userID } );
        if(deletedCart){
            res.send({message:"Cart Deleted Successfully"});
        }else{
            res.send({message:"No Item found with the given id"});
        }  
        console.log(userID);
    }catch(err){
        res.status(500).send(err);
    }
})

// Handling DELETE Request for individual record
router.delete("/:_id",verify,async (req,res)=>{
    try{
        const _id = req.params._id;
        console.log(req.params)
        const deletedCartItem = await Cart.findByIdAndDelete(_id);
        
        if(deletedCartItem){
            res.send({message:"Item Removed from cart"});
        }else{
            res.send({message:"No Item found with the given id"});
        }    
    }catch(err){
        res.status(500).send(err);
    }
});


// Handling UPDATE (PATCH, put)
router.patch("/:_id",verify,async (req,res)=>{
    try{
        const _id = req.params._id
        const updatedCartItem = await Cart.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        res.send(updatedCartItem);
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;