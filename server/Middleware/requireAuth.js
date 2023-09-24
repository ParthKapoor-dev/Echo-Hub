const jwt = require('jsonwebtoken');
const User = require('../model/userModel')
async function requireAuth(req , res , next){

    const {authorization} = req.headers;
    if(!authorization) 
        return res.status(401).json({message : 'Auth failed'})
    const token = authorization.split(' ')[1];

    try{
        const {id} = jwt.verify(token , process.env.SECRET );
        req.user = await User.findOne({_id : id}).select('_id');
        next();
    }catch(error){
        console.log(error);
    }

}

module.exports = requireAuth