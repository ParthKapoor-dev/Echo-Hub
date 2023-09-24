const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title:{
        type: String,
        required : true
    },
    article:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    userName:{
        type:String , 
        required:true
    }
})

module.exports = mongoose.model('Article' , ArticleSchema)