const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : {
        type : String, 
        required : true
    },
    email : {
        type : String, 
        required : true
    },
    password : {
        type : String, 
        required : true
    },
    followers:{
        type:Array,
        required: true   
    },
    following:{
        type:Array,
        required: true
    },
    list : {
        type:Array,
        required:true        
    },
    profilePicture : {
        type : String
    },
    backgroundImage : {
        type : String
    },
    bio:{
        type : String
    }
})
UserSchema.statics.signup = async function (name , email , password){
    if( !email || !password) 
        throw Error('All fields are required');
    if(!validator.isEmail(email))
        throw Error("Please enter a valid email");

    const userExists = await this.findOne({email});
    if(userExists) throw Error("User already exists , try loging In");

    if(!validator.isStrongPassword(password))
        throw Error("Please enter a strong password");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password , salt);

    const user = await this.create({name , email , password : hash , followers :[] , following: [],list : [] , profilePicture : "" , backgroundImage : "" , bio : ""});

    return user
}
UserSchema.statics.login = async function (email , password){
    if(!email || !password) 
        throw Error("All fields are required");

    const user = await this.findOne({email})
    if(!user) throw Error("Incorrect Email for login");

    const compare = await bcrypt.compare(password , user.password);

    if(!compare){
    throw Error("Incorrect Password");
    }

    return user
}
module.exports = mongoose.model("User",UserSchema)