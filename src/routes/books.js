const express = require("express");
const router = new express.Router();
const Books = require("../models/book");
const verify = require("./verifyToken");


//Handling POST Request only admin can add a book
router.post("/", verify, async (req, res) => {
    if (req.user.role == "admin") {
        const bookCollection = new Books(
            {
                book_code: req.body.book_code,
                book_name: req.body.book_name,
                book_author: req.body.book_author,
                book_image: req.body.book_image,
                price: req.body.price,
                discount:req.body.discount,
                category: req.body.category,
                book_description: req.body.book_description
            });
        try {
            // console.log(bookCollection);
            const insertedBook = await bookCollection.save();
            res.status(201).send(insertedBook);
        } catch (err) {
            res.status(400).send(err);
        }
    }else{
        res.status(403).send("Access Denied");
    }
});

// Handling UPDATE (PATCH, put) Request for individual record
router.patch("/:_id",verify,async (req,res)=>{
    try{
        const _id = req.params._id
        const updateBook = await Books.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        res.send(updateBook);
    }catch(err){
        res.status(400).send(err);
    }
});

// Handling DELETE Request for individual record
router.delete("/:_id",verify,async (req,res)=>{
    try{
        const _id = req.params._id
        const deletedBook = await Books.findByIdAndDelete(_id);
        if(deletedBook){
            res.send({message:"Book Deleted"});
        }else{
            res.status(204).send();
        }
        
    }catch(err){
        res.status(500).send(err);
    }
});

//Handling GET Request also getting data based on category
router.get("/", async (req, res) => {
    const category = req.query.category;
    try {
        let books;
        if (category) {
            books = await Books.find({ category: category });
            // console.log(books);
            if(books.length === 0){
                res.status(204).send();
            }else{
                res.send(books);
            }
        } else {
            books = await Books.find({});
            res.send(books);
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});

//Handling GET Request also getting data based on category
router.get("/search", async (req, res) => {
    const searched = req.query.search;
    // console.log(searched)
    try {
        const searchedBooks = await Books.find(
            {
                $or: [{ book_name: { $regex: searched, $options: 'i' } },
                { book_description: { $regex: searched, $options: 'i' } },
                { book_author: { $regex: searched, $options: 'i' } }]
            });
            // console.log(searchedBooks);
            if(searchedBooks.length === 0){
                res.status(204).send();
            }else {
                res.send(searchedBooks);
            }
    } catch (err) {
        res.status(400).send(err);
    }
});

//Handling GET Request for individual based on id
router.get("/:_id", async (req, res) => {
    try {
        const _id = req.params._id;
        const bookDetails = await Books.findById(_id);
        // console.log(bookDetails);
        if(bookDetails !== null){
            res.send(bookDetails);
        }else{
            res.status(204).send();
        }
        
    } catch (err) {
        res.status(400).send(err);
    }

});

module.exports = router;