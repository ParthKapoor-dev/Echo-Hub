const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

function createToken (id) {
    return jwt.sign({id}, process.env.SECRET , {expiresIn : '3d'})
}

async function Login(req , res){
    const { email , password } = req.body;
    try{
        const user = await User.login(email , password);
        const token = createToken(user._id);
        res.status(200).json({user , token})
    }catch(error){
        res.status(500).json({message : error.message});
    }
}
async function Signup(req , res){
    const { name , email , password } = req.body;

    try{
        const user = await User.signup(name , email , password);
        const token = createToken(user._id);
        res.status(200).json({user,token});
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports = {
    Login , 
    Signup
}