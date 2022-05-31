const express = require("express");
const router = new express.Router();
const Books = require("../models/book");
const Reviews = require("../models/Review");
const verify = require("./verifyToken");


//Handling POST Request only admin can add a book
router.post("/",verify, async (req, res) => {
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
            if(insertedBook){
                res.status(201).send(insertedBook);
            }else{
                res.status(204).send();
            }
        } catch (err) {
            if(err.errors){
                res.status(400).send(err);
            }else{
                res.status(422).send({message:"Book Code Must be Unique"});
            }
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
        if(err.errors){
            res.status(400).send(err);
        }else{
            res.status(422).send({message:"Book Code Must be Unique"});
        }
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
            books = await Books.find({ category: { $regex: category, $options: 'i' } });
            // console.log(books);
            if(books.length > 0){
                let book_ids=[];
                books.forEach((book)=>{
                    book_ids.push(String(book._id));
                });
                // console.log(book_ids);
                const reviews = await Reviews.find({ book_id: { $in: book_ids }},
                    {
                        user_id:0,
                        review:0,
                        date:0, 
                        __v:0,
                        _id:0
                    });
                // console.log(reviews)             
                for(let i=0; i<books.length; i++){
                    let sum=0;
                    let review_count=0;
                    for(let j=0; j<reviews.length; j++){
                        if(books[i]._id == reviews[j].book_id){
                            sum=sum+reviews[j].rating;
                            review_count++;
                        }else{
                            continue;
                        }
                    }
                    let ratingAvg=0;
                    if(sum != 0){
                        ratingAvg=sum/review_count;
                        ratingAvg = ratingAvg.toFixed(1);
                        ratingAvg = Number(ratingAvg); 
                    }
                    books[i].set( "rating",ratingAvg, { strict: false });
                }
                res.send(books);
            }else{
                res.status(204).send();
            }
        } else {
            books = await Books.find({});
            if(books.length>0){
                res.send(books);
            }else{
                res.status(204).send();
            }
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});

const AttachReview = (books)=>{

}
//Handling GET Request also getting data based on category
router.get("/search", async (req, res) => {
    const searched = req.query.search;
    // console.log(searched)
    try {
        const searchedBooks = await Books.find(
            {
                $or: [{ book_name: { $regex: searched, $options: 'i' } },
                { book_description: { $regex: searched, $options: 'i' } },
                { book_author: { $regex: searched, $options: 'i' } },
                { category: { $regex: searched, $options: 'i' } }]
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

router.get("/search_suggestions", async (req, res) => {
    const searched = req.query.keyWord;
    // console.log(searched)
    try {
            let suggestedResults = [];
            const searchedBookNames = await Books.find(
            {
                book_name: { $regex: searched, $options: 'i' },
            },
            {
                book_author:0,
                book_image:0,
                book_description:0,
                price:0,
                book_code:0,
                category:0,
                discount:0, 
                createdAt:0,
                updatedAt:0,
                __v:0,
                _id:0
            });
            if(searchedBookNames.length > 0){
                suggestedResults = [...searchedBookNames];     
                // res.send(searchedBookNames);
            }
            const searchedAuthors = await Books.find(
                {
                    book_author: { $regex: searched, $options: 'i' } 
                },
                {
                    book_name:0,
                    book_image:0,
                    book_description:0,
                    price:0,
                    category:0,
                    book_code:0,
                    discount:0,
                    createdAt:0,
                    updatedAt:0, 
                    __v:0,
                    _id:0
                });
                if(searchedAuthors.length>0){
                    suggestedResults = [...suggestedResults, ...searchedAuthors];
                //    res.send(searchedAuthors);
                }
                const searchedCategory = await Books.find(
                    {
                        category: { $regex: searched, $options: 'i' },
                    },
                    {
                        book_name:0,
                        book_author:0,
                        book_image:0,
                        book_description:0,
                        price:0,
                        book_code:0,
                        discount:0,
                        createdAt:0,
                        updatedAt:0, 
                        __v:0,
                        _id:0
                    });
                    if(searchedCategory.length>0){
                        suggestedResults = [...suggestedResults, ...searchedCategory];
                    }

                    if(suggestedResults.length>0){
                        res.send(suggestedResults)
                    }else{
                        res.status(204).send();
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