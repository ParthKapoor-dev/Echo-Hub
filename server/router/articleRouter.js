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
    deleteArticles
} = require('../controller/articleController');
const requireAuth = require('../Middleware/requireAuth');

router.use(requireAuth);

router.get('/feed/:query' , articleFeed);

router.get('/list/:query' , ListArticles)

router.put('/list/add' , addtolist);

router.put('/list/remove' , removeFromList);

router.delete('/',deleteArticles)

router.get('/user/:query',displayArticles);

router.post('/write',publishArticle);

router.get('/:query' , displayArticle)

module.exports = router;