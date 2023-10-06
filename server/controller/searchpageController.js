const User = require('../model/userModel')
const Article = require('../model/articleModel')
async function userSearch(req , res){
    const query = req.params.query.toLowerCase();

    function filterDuplicateItems(ItemsArray){
        const Items = [];

        for(var i = 0 ; i < ItemsArray.length ; i++){
            var flag = true
            for(var j = i + 1 ; j < ItemsArray.length ; j++){
                if(ItemsArray[i] == ItemsArray[j]) flag = false;
            }
            if(flag) Items.push(ItemsArray[i]);
        }
        return Items;    
    }
    function getTagsByArticles(articles){
        const tags = [];

        for(const article of articles){
            const articleTags = article.tags;
            if(articleTags?.length) tags.push(...articleTags);
        }

        const finalTags = filterDuplicateItems(tags);
        return finalTags
    }
    async function getTagsByAccounts(accounts){
        const tags = [];

        for(const account of accounts){
            const articles = await Article.find({userId : account._id });
            const articleTags = getTagsByArticles(articles);
            if(articleTags?.length) tags.push(...articleTags);
        }

        const finalTags = filterDuplicateItems(tags);
        return finalTags
    }
    try{
        const users = await User.find({});
        const relatedUsers = users.filter(user=>user.name.toLowerCase().includes(query));
        const relatedTags = await getTagsByAccounts(relatedUsers)
        res.json({relatedUsers , relatedTags});
    }catch(error){  
        console.log(error);
        res.json({message : error.message});
    }
}
async function articleSearch(req , res){
    const query = req.params.query.toLowerCase();

    function filterDuplicateItems(ItemsArray){
        const Items = [];

        for(var i = 0 ; i < ItemsArray.length ; i++){
            var flag = true
            for(var j = i + 1 ; j < ItemsArray.length ; j++){
                if(ItemsArray[i] == ItemsArray[j]) flag = false;
            }
            if(flag) Items.push(ItemsArray[i]);
        }
        return Items;    
    }
    function getTagsByArticles(articles){
        const tags = [];

        for(const article of articles){
            const articleTags = article.tags;
            if(articleTags?.length) tags.push(...articleTags);
        }

        const finalTags = filterDuplicateItems(tags);
        return finalTags
    }

    try{
        const articles = await Article.find({});
        const relatedArticles = articles.filter(article=>article.title.toLowerCase().includes(query));
        const relatedTags = getTagsByArticles(relatedArticles)
        res.json({relatedArticles , relatedTags});
    }catch(error){
        console.log(error);
        res.json({message : error.message});
    }
}

module.exports = {
    userSearch,
    articleSearch
}