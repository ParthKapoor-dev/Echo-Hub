const User = require('../model/userModel')
const Article = require('../model/articleModel')
async function userSearch(req , res){
    const query = req.params.query.toLowerCase();

    try{
        const users = await User.find({});
        const relatedUsers = users.filter(user=>user.name.toLowerCase().includes(query));
        res.json(relatedUsers);
    }catch(error){  
        console.log(error);
        res.json({message : error.message});
    }
}
async function articleSearch(req , res){
    const query = req.params.query.toLowerCase();

    try{
        const articles = await Article.find({});
        const relatedArticle = articles.filter(article=>article.title.toLowerCase().includes(query));
        const finalArticles = await Promise.all(relatedArticle.map(async (article)=>{
            const profilePicture = await User.findOne({_id : article.userId}).select('profilePicture');
            const data = {...article._doc , profilePicture : profilePicture.profilePicture};
            return data;
        }))
        res.json(finalArticles);
    }catch(error){
        console.log(error);
        res.json({message : error.message});
    }
}

module.exports = {
    userSearch,
    articleSearch
}