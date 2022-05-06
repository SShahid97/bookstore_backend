const express = require("express");
const router = new express.Router();
const Reviews = require("../models/Review");
const User = require('../models/User');
const verify = require("./verifyToken");

//Handling POST Request
router.post("/",verify, async (req, res) => {
        const reviewCollection = new Reviews(
            {
                book_id: req.body.book_id,
                user_id: req.body.user_id,
                review: req.body.review,
                rating:req.body.rating
            });
        try {
            // console.log(bookCollection);
            const insertedReview = await reviewCollection.save();
            res.status(201).send(insertedReview);
        } catch (err) {
            res.status(400).send(err);
        }
});

// Get reviews for already sumbitted books
router.get("/submitted", verify, async (req,res)=>{
    try{
        // console.log(req.query);
        const bookId = req.query.book_id;
        const userId = req.query.user_id;
        const reviewReturned = await Reviews.find({ book_id: bookId, user_id:userId  });
        if(reviewReturned.length === 0){
            res.status(204).send();
        }else{
            res.status(200).send(reviewReturned[0]);
        }
        // console.log(reviewReturned);
    }catch(err){
        res.status(400).send(err);
    }
})

// get request for fetching all the reviews for a particular book
router.get("/:_id", async (req, res)=>{  //_id is book id
    try{
        const user_ids=[];
        const _id = req.params._id;
        const reviewsReturned = await Reviews.find({ book_id: _id });
        if(reviewsReturned.length>0){
            // pushing ids of users 
            reviewsReturned.forEach((item)=>{
                user_ids.push(item.user_id);
            });
            // console.log(user_ids);
            // getting users from the user collection based on the user id array
            let users = await User.find({ _id: { $in: user_ids }},{
                password:0,
                role:0,
                date:0,
                __v:0
            });
            // console.log(users)
            // adding the returned users to each review   
            
            reviewsReturned.forEach((item)=>{
                for(let i=0; i<users.length; i++){
                    // console.log(item.user_id);
                    // console.log(users[i]._id);

                    if(String(item.user_id) == String(users[i]._id)){
                        // adds a new key value pair (book:{}) to the CartItems object
                        item.set( "user",users[i], { strict: false });
                        
                        // deletes "user_id" key from the CartItems object
                        item.set('user_id', undefined, {strict: false});
                        break;
                    }
                }
            })          
            res.status(200).send(reviewsReturned);
        }else{
            res.status(204).send();
        } 
    }catch(err){
        res.status(400).send(err);
    }
})


module.exports = router;