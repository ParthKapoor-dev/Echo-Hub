const express = require('express');
const router = express.Router();
const requireAuth = require('../Middleware/requireAuth');
const {
    userSearch,
    articleSearch
} = require('../controller/searchpageController');

router.use(requireAuth)

router.get('/user/:query' , userSearch);

router.get('/articles/:query' , articleSearch);

module.exports = router;