const Article = require('../model/articleModel');
const User = require('../model/userModel')
async function articleFeed(req , res){
    const userId = req.params.query;

    try{
        const following = await User.find({_id : userId}).select('following');
        const articles = await Promise.all(following[0].following.map( 
            async (followId) => await Article.find({userId : followId})))

        const finalArticles = articles.filter(item => item.length)
        res.json(finalArticles)
    }catch(error){
        console.log(error);
        res.send({message : error.message})
    }
}
async function ListArticles(req , res){
    const userId = req.params.query;

    try{
        const list = await User.find({_id : userId}).select('list');
        const articles = await Promise.all(list[0].list.map( 
            async (articleId) => await Article.find({_id : articleId})))

        const finalArticles = articles.filter(item => item.length)
        res.json(finalArticles)
    }catch(error){
        console.log(error);
        res.send({message : error.message})
    }
}
async function displayArticle(req , res){
    const searchQuery = req.params.query;

    try{
        const article = await Article.findOne({_id : searchQuery});
        res.json(article);
    }catch(error){
        console.log(error);
        res.json({message : error.message})
    }
}
async function publishArticle(req , res ){
    const { title , article , userName } = req.body;
    const userId = req.user._id;
    try{
        const articleResponse = await Article.create({title , article , userId , userName});
        res.json(articleResponse)
    }catch(error){
        console.log(error)
        res.json({message : error.message}) 
    }
}
async function addtolist(req , res){
    const {userId , articleId} = req.body;
    try{
        const user = await User.findOne({_id : userId}).select('list');
        user.list.push(articleId);
        user.save();
        console.log(user);
        res.json(user);
    }catch(error){
        console.log(error);
        res.json({message : error.message})
    }
}
async function removeFromList(req , res) {
    const {userId , articleId} = req.body;
    try{
        const user = await User.findOne({_id : userId}).select('list');
        user.list = user.list.filter(item => item !== articleId);
        user.save();
        res.json(user);
    }catch(error){
        console.log(error);
        res.json({message : error.message})
    }
}
async function displayArticles(req , res){
    const userId = req.user._id;
    try{
        const articles = await Article.find({userId});
        res.json(articles);
    }catch(error){
        console.log(error)
        res.json({message:error.message})
    }
}
async function deleteArticles(req , res){
    const { userId , _id } = req.body;
    try{
        const articles = await Article.deleteOne({userId , _id});
        res.json(articles)
    }catch(error){
        console.log(error);
        res.json({message : error.message})
    }
}
module.exports = {
    publishArticle,
    displayArticle,
    articleFeed,
    ListArticles,
    addtolist,
    removeFromList,
    displayArticles,
    deleteArticles
}