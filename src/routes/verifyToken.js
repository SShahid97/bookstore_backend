const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middle ware
module.exports = async function(req, res, next){
    const token = req.header('auth-token');
    if(!token)
        return res.status(401).send({message:"Access Denied"});

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const _id = verified._id;
        const _user = await User.findOne({_id});
        // console.log(_user);
        req.user={...verified, role:_user.role};
        next();
    }catch(err){
        res.status(400).send({message:"Your Authentication Token is Invalid"});
    }

}