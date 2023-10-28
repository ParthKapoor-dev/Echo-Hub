const Article = require('../model/articleModel');
const User = require('../model/userModel');
const { v4: uuidv4 } = require('uuid');

async function articleFeed(req, res) {
    const user = req.user

    function getLikedTags(likedArticles) {
        const tags = [];

        for (const article of likedArticles) {
            if (article) tags.push(...article.tags)
        }
        const finalTags = filterDuplicateItems(tags);
        return finalTags;
    }

    function filterDuplicateItems(ItemsArray) {
        const Items = [];

        for (var i = 0; i < ItemsArray.length; i++) {
            var flag = true
            for (var j = i + 1; j < ItemsArray.length; j++) {
                if (ItemsArray[i] == ItemsArray[j]) flag = false;
            }
            if (flag) Items.push(ItemsArray[i]);
        }
        return Items;
    }

    function filterDuplicateArticles(ItemsArray) {
        const Items = [];
        for (var i = 0; i < ItemsArray.length; i++) {
            var flag = true;
            if (ItemsArray[i].userId.toString() === user._id.toString()) {
                flag = false;
                continue;
            }
            for (var j = i + 1; j < ItemsArray.length; j++) {
                if (ItemsArray[i]._id.toString() === ItemsArray[j]._id.toString()) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                Items.push(ItemsArray[i]);
            }
        }
        return Items;
    }


    async function getArticlesByFollowings(followings) {
        const articles = [];

        for (const userId of followings) {
            const userArticles = await Article.find({ userId });
            articles.push(...userArticles);
        }
        const finalArticles = filterDuplicateItems(articles);
        return finalArticles;
    }

    async function getArticlesByTags(tags) {
        const articles = [];

        for (const tag of tags) {
            const taggedArticles = await Article.find({ tags: tag });
            articles.push(...taggedArticles);
        }
        const finalArticles = filterDuplicateArticles(articles);
        return finalArticles;
    }

    async function getAccountsByArticles(articles) {
        const accounts = [];
        for (const article of articles) {
            const user = await User.findOne({ _id: article.userId });
            if (user) accounts.push(user);
        }
        return accounts;
    }

    function filterDuplicateAccounts(ItemsArray) {
        const Items = [];
        for (var i = 0; i < ItemsArray.length; i++) {
            var flag = true;
            if (ItemsArray[i]._id.toString() === user._id.toString() ||
                ItemsArray[i].followers.includes(user._id)) {
                flag = false;
                continue;
            }
            for (var j = i + 1; j < ItemsArray.length; j++) {
                if (ItemsArray[i]._id.toString() === ItemsArray[j]._id.toString()) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                Items.push(ItemsArray[i]);
            }
        }
        return Items;
    }
    async function AddEditorsChoiceArticles(finalArticles) {
        const articles = await Article.find({ tags: "Editor's Choice" });
        const theFinalArticles = [...finalArticles, ...articles];
        const returnedArticles = filterDuplicateArticles(theFinalArticles);
        return returnedArticles
    }
    async function AddEditorsChoiceAccounts(finalAccounts) {
        const editorsArticles = await Article.find({ tags: "Editor's Choice" });
        const filteredEditorsArticles = filterDuplicateArticles(editorsArticles);
        const editorsAccounts = [];
        for (const article of filteredEditorsArticles) {
            const user = await User.findOne({ _id: article.userId });
            if (user) editorsAccounts.push(user);
        }
        const theFinalAccounts = [...finalAccounts, ...editorsAccounts];
        const returnedAccounts = filterDuplicateAccounts(theFinalAccounts);
        return returnedAccounts
    }

    try {
        const followings = await User.findOne({ _id: user._id }).select('following');
        const LikedArticles = await Article.find({ likes: user._id });
        const LikedTags = getLikedTags(LikedArticles);

        const FollowingsArticles = await getArticlesByFollowings(followings.following);
        const LikedtagsArticles = await getArticlesByTags(LikedTags);
        const articles = [...FollowingsArticles, ...LikedtagsArticles];
        finalArticles = filterDuplicateArticles(articles);

        if (finalArticles.length <= 3)
            finalArticles = await AddEditorsChoiceArticles(finalArticles);

        const likedtagsAccounts = await getAccountsByArticles(LikedtagsArticles);
        finalAccounts = filterDuplicateAccounts(likedtagsAccounts);

        if (finalAccounts.length <= 1)
            finalAccounts = await AddEditorsChoiceAccounts(finalAccounts);



        res.json({ finalArticles, finalAccounts, LikedTags });
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
async function deleteArticleComment(req, res) {
    const { articleId, commentId } = req.body;

    try {
        const article = await Article.findOne({ _id: articleId });
        const updatedArticle = article.comments.filter(item => item.commentId !== commentId);
        article.comments = updatedArticle;
        await article.save();

        res.json(article);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}
async function articleComment(req, res) {
    const { articleId, commentUserName, commentProfilePicture, comment } = req.body;
    const user = req.user;
    const date = new Date;

    function uniqueCommentIdFunc(article) {
        const uniqueCommentId = uuidv4();
        const isDuplicate = article.comments.some(item => item.commentId === uniqueCommentId);

        if (!isDuplicate) return uniqueCommentId;
        return uniqueCommentIdFunc(article);
    }
    try {
        const article = await Article.findOne({ _id: articleId });
        const uniqueCommentId = uniqueCommentIdFunc(article);

        const data = {
            userId: user._id,
            articleId,
            commentId: uniqueCommentId,
            commentUserName,
            commentProfilePicture,
            comment,
            date: date.toString(),
            likes: []
        };


        article.comments.unshift(data);
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
    articleComment,
    deleteArticleComment
}