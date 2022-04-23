const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation')


//Handling GET Request also getting data based on category
router.get("/", async (req, res) => {
    try {
        const  users = await User.find({});  //find all
        res.send(users);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Register Route
router.post("/register", async(req, res)=>{
    // Validation
    const {error} = registerValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
        // {message:error.details[0].message}
    //Checking if the user already exists  
    const emailExist = await User.findOne({email:req.body.email})
    if(emailExist) 
        return res.status(400).send({message: "Email already exists"});
    
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); 
    //If there is no error 
    // Create a new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });
    try{
        const savedUser = await user.save();
        const userDetail={
            _id:savedUser._id,
            name:savedUser.name,
            email:savedUser.email,
        } 
        res.status(201).send(userDetail); 
    }catch(err){
        res.status(400).send(err);
    }   
});


// Login Route
router.post("/login",async(req,res)=>{
    // Validation
    const {error} = loginValidation(req.body);
    if (error)
        return res.status(400).send({message:error.details[0].message});
    
    //Checking if the user exists  
    const user = await User.findOne({email:req.body.email})
    if(!user) 
        return res.status(400).send({message:"Email doesn't exist"});    
    
    // Checking if the password is correct or not
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if (!validPassword)
        return res.status(400).send("Invalid password");

    // Create and assign a token
    const token =  jwt.sign({_id:user._id},process.env.TOKEN_SECRET);    //,{ expiresIn: '60s' } 1d, 20h..
    
    const user_details = {
        _id:user._id,
        name:user.name,
        email :user.email,
        role:user.role
    }
    // setting token in header
    res.header('auth-token',token).send({...user_details, token:token});
    
    // if everything is ok
    // res.send("Successfully logged in");
});
module.exports = router;