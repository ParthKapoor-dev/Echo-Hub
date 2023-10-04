const Article = require('../model/articleModel');
const User = require('../model/userModel')
async function articleFeed(req, res) {
    const user = req.user

    function getLikedTags(likedArticles){
        const tags = [];

        for(const article of  likedArticles ){
            if(article) tags.push(...article.tags)
        }

        return tags;
    }

    function filterDuplicateItems(ItemsArray){
        const Items = [];

        for(var i = 0 ; i < ItemsArray.length ; i++){
            var flag = true
            for(var j = i + 1 ; j < ItemsArray.length ; j++){
                if(!(ItemsArray[i] == ItemsArray[j])) flag = false;
            }
            if(flag) Items.push(ItemsArray[i]);
        }
        return Items;    
    }

    async function getArticlesByFollowings(followings) {
        const articles = [];

        for (const userId of followings) {
            const userArticles = await Article.find({ userId });
            articles.push(...userArticles);
        }

        return articles;
    }

    async function getArticlesByTags(tags) {
        const articles = [];

        for (const tag of tags) {
            const taggedArticles = await Article.find({ tags: tag });
            articles.push(...taggedArticles);
        }

        return articles;
    }

    try {
        const followings = await User.findOne({ _id: user._id }).select('following');
        const LikedArticles = await Article.find({ likes: user._id });
        const LikedTags = getLikedTags(LikedArticles);

        const FollowingsArticles = await getArticlesByFollowings(followings.following);

        const LikedtagsArticles = await getArticlesByTags(LikedTags);

        const articles = [...FollowingsArticles, ...LikedtagsArticles];
        const finalArticles = filterDuplicateItems(articles);

        // console.log(articles , finalArticles)

        
        res.json(finalArticles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
async function ListArticles(req, res) {
    const userId = req.params.query;

    try {
        const list = await User.find({ _id: userId }).select('list');
        const articles = await Promise.all(list[0].list.map(
            async (articleId) => await Article.find({ _id: articleId })))

        const finalArticles = articles.filter(item => item.length)
        res.json(finalArticles)
    } catch (error) {
        console.log(error);
        res.send({ message: error.message })
    }
}
async function displayArticle(req, res) {
    const searchQuery = req.params.query;

    try {
        const article = await Article.findOne({ _id: searchQuery });
        res.json(article);

    } catch (error) {
        console.log(error);
        res.json({ message: error.message })
    }
}
async function publishArticle(req, res) {
    const { title, article, userName, tags, userProfilePicture } = req.body;
    console.log(userProfilePicture)
    const userId = req.user._id;
    const date = new Date;

    try {
        const articleResponse = await Article.create({ title, article, userId, userName, likes: [], comments: [], date, tags, userProfilePicture });
        res.json(articleResponse)
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
}
async function addtolist(req, res) {
    const { userId, articleId } = req.body;
    try {
        const user = await User.findOne({ _id: userId }).select('list');
        user.list.push(articleId);
        user.save();
        console.log(user);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.json({ message: error.message })
    }
}
async function removeFromList(req, res) {
    const { userId, articleId } = req.body;
    try {
        const user = await User.findOne({ _id: userId }).select('list');
        user.list = user.list.filter(item => item !== articleId);
        user.save();
        res.json(user);
    } catch (error) {
        console.log(error);
        res.json({ message: error.message })
    }
}
async function displayArticles(req, res) {
    const userId = req.params.query;
    try {
        const articles = await Article.find({ userId });
        res.json(articles);
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
}
async function deleteArticles(req, res) {
    const { _id } = req.body;
    try {
        const articles = await Article.findOneAndDelete({ _id });
        res.json(articles)
    } catch (error) {
        console.log(error);
        res.json({ message: error.message })
    }
}
async function articleComment(req, res) {
    const { articleId, comment } = req.body;
    const user = req.user;

    try {

        const data = { userId: user._id, userName: user.name, UserProfilePicture: user.profilePicture, comment };

        const article = await Article.findOne({ _id: articleId });

        article.comments.push(data);
        await article.save();

        res.json(article);
    } catch (error) {
        res.json({ message: error.message });
    }
}
async function articleLike(req, res) {
    const _id = req.body.articleId;
    const userId = req.user._id;
    try {
        const article = await Article.findOne({ _id });
        if (article.likes.includes(userId)) {
            article.likes = article.likes.filter(item => item === userId);
        }
        else {
            article.likes.push(userId);
        }
        await article.save();

        res.json(article);
    } catch (error) {
        console.log(error);
        res.json({ message: error?.message })
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
    deleteArticles,
    articleLike,
    articleComment
}