const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/",verify,(req, res)=>{
    if(req.user.role == "admin"){
        res.json({
            posts:{
                title:"my first post",
                description:"This is the description"
        }});
    }else{
        res.send("You are not allowed"); 
    }
    
});

module.exports = router;

