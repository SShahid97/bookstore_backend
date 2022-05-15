const express = require("express");
const router = new express.Router();
const Wishlist = require("../models/Wishlist");
const Book = require("../models/book");
const verify = require("./verifyToken");
const Stock = require("../models/Stock");


// handles inserting a cart item
// verify
router.post("/",verify, async (req, res) => {
        const wishlistCollection = new Wishlist(
            {
                user_id: req.body.user_id,
                book_id: req.body.book_id
            });
        try {
            const insertedWishlistItem = await wishlistCollection.save();
            res.status(201).send(insertedWishlistItem);
        } catch (err) {
            res.status(400).send(err);
        }

});

// verify,
//Handling GET Request for individual based on id
router.get("/:_id", verify, async (req, res) => {
    try {
        let book_ids=[];
        // let stockDetails = [];
        const _id = req.params._id;
        const WishlistItems = await Wishlist.find({ user_id: _id }).sort({date:-1});
        if(WishlistItems.length>0){
            // pushing ids of books for a specific user from cart collection into an array
            WishlistItems.forEach((item)=>{
                book_ids.push(item.book_id);
            });

            // getting books from the book collection based on the books id array
            const books = await Book.find({ _id: { $in: book_ids }});
            
            // getting stock details of each book
            const stockDetails = await Stock.find({ book_id: { $in: book_ids }});
            // console.log(stockDetails);

            // adding the returned book items to each object in cart response  
            WishlistItems.forEach((item)=>{
                for(let i=0; i<books.length; i++){
                    if(String(item.book_id) == String(books[i]._id)){
                        // adds a new key value pair (book:{}) to the CartItems object
                        item.set( "book",books[i], { strict: false });
                        item.set("count_in_stock",stockDetails[i].count_in_stock,{strict:false})
                        // deletes "book_id" key from the CartItems object
                        item.set('book_id', undefined, {strict: false});
                        break;
                    }
                }
            })
            res.send(WishlistItems);
        }else{
            res.status(204).send();
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});

// Handling DELETE Request for individual record
// verify,
router.delete("/:_id",verify,async (req,res)=>{
    try{
        const _id = req.params._id;
        // console.log(req.params)
        const deletedWishlistItem = await Wishlist.findByIdAndDelete(_id);
        
        if(deletedWishlistItem){
            res.send({message:"Item deleted from wishlist"});
        }else{
            res.status(204).send();
        }    
    }catch(err){
        res.status(500).send(err);
    }
});
module.exports = router;