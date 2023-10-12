const express = require('express');
const router = express.Router();
const {
    publishArticle,
    displayArticles,
    articleFeed,
    ListArticles,
    addtolist,
    removeFromList,
    displayArticle,
    deleteArticles,
    articleLike,
    articleComment,
    deleteArticleComment
} = require('../controller/articleController');
const requireAuth = require('../Middleware/requireAuth');

router.use(requireAuth);

router.get('/feed' , articleFeed);

router.get('/list/:query' , ListArticles)

router.put('/list/add' , addtolist);

router.put('/list/remove' , removeFromList);

router.delete('/',deleteArticles)

router.get('/user/:query',displayArticles);

router.post('/write',publishArticle);

router.get('/:query' , displayArticle);

router.put('/like' , articleLike);

router.put('/comment' , articleComment);

router.put('/comment/delete' , deleteArticleComment);
module.exports = router;