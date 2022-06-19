const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require("./verifyToken");
const {registerValidation, loginValidation} = require('../validation')


//Handling GET Request 
router.get("/",verify, async (req, res) => {
    try {
        const users = await User.find({});  //find all
        if(users.length > 0){
            res.send(users);
        }else{
            res.status(204).send();
        }
    } catch (err) {
        res.status(400).send(err);
    }
});
router.get("/:_id",verify, async (req, res) => {
    try {
        let userId=req.params._id;
        const user = await User.findById(userId);  //find all
        if(user!= null){
            let returnedUser = {
                name:user.name,
                email:user.email
            }
            res.send(returnedUser);
        }else{
            res.status(204).send();
        }
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
        return res.status(409).send({message: "Email already exists"});
    
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
        return res.status(204).send();    
    
    // Checking if the password is correct or not
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if (!validPassword)
        return res.status(401).send({message:"Invalid password"});

    // Create and assign a token
    const token =  jwt.sign({_id:user._id},process.env.TOKEN_SECRET);    //,{ expiresIn: '60s' } 1d, 20h..
    
    const user_details = {
        _id:user._id,
        name:user.name,
        email :user.email,
        profile_pic:user.profile_pic,
        role:user.role
    }
    // setting token in header
    res.header('auth-token',token).send({...user_details, token:token});
    
    // if everything is ok
    // res.send("Successfully logged in");
});


// Delete the user
router.delete("/:_id",verify,async (req,res)=>{
    try{
        const _id = req.params._id;
        // console.log(req.params)
        const deletedUser= await User.findByIdAndDelete(_id);
        
        if(deletedUser){
            res.send({message:"User Deleted"});
        }else{
            res.status(204).send();
        }    
    }catch(err){
        res.status(500).send(err);
    }
});

// verify password
router.post("/verifypassword",verify,async(req,res)=>{
    try{
         //Checking if the user exists  
        const user = await User.findOne({email:req.body.email});
         // Checking if the password is correct or not
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if (!validPassword){
            return res.status(401).send({message:"Wrong Password"});
        }else{
            res.status(200).send({message:"Correct Password"})
        }
    }catch(err){
        res.status(400).send(err);
    }
});

router.patch("/:_id",  async(req,res)=>{
    const _id = req.params._id;
    if(req.body.password){
        console.log("yess password");
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await  bcrypt.hash(req.body.password, salt);
            const updatedPassword = await User.findByIdAndUpdate(_id,{
                password:hashedPassword
            },{ 
                 new:true
            });
            if(updatedPassword){
                
                // console.log(updatedPassword);
                 res.send({message:"Password Changed Successfully"});
            }else{
                res.status(204).send();
            }
        }catch(err){
            return err;
        }
    }else if(req.body.name){
        console.log("yes name");
         try{
            const updatedName = await User.findByIdAndUpdate(_id,req.body,{ 
                 new:true
            });
            if(updatedName){
                // console.log(updatedName);
                 res.send({message:"Name Changed Successfully"});
            }else{
                res.status(204).send();
            }
        }catch(err){
            return err;
        }
    }else if(req.body.profile_pic){
        console.log("yes profile pic");
         try{
            const updatedUser = await User.findByIdAndUpdate(_id,req.body,{ 
                 new:true
            });
            if(updatedUser){
                // console.log(updatedUser);
                 res.send({message:"Profile pic name added successfully"});
            }else{
                res.status(204).send();
            }
        }catch(err){
            return err;
        }
    }
    
})


// verify email
router.post("/verifyemail",async(req,res)=>{
    try{
         //Checking if the user exists  
        const returnedUser = await User.findOne({email:req.body.email});
        console.log(returnedUser);
        if(returnedUser!==null){
            const userDetail={
                _id:returnedUser._id,
                name:returnedUser.name,
                email:returnedUser.email,
            } 
            res.status(200).send(userDetail)
        }else if (returnedUser === null){
            return res.status(204).send();
        }
      
    }catch(err){
        res.status(400).send(err);
    }
});



module.exports = router;