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

router.get('/:query' , displayArticle)

router.get('/',displayArticles);

router.delete('/',deleteArticles)

router.post('/write',publishArticle);

module.exports = router;