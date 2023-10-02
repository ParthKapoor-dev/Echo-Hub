const express = require('express');
const router = express.Router();
const requireAuth = require('../Middleware/requireAuth');
const {
    Allusers,
    follow,
    unfollow,
    UserProfile,
    uploadProfilePic,
    updateProfile,
    userFollowings,
    landingPageBio
} = require('../controller/accountUserController');

router.use(requireAuth);

router.get('/userProfile/:id' , UserProfile)

router.get('/all' , Allusers);

router.put('/follow', follow);

router.put('/unfollow', unfollow);
    
router.put('/upload/profilePic/:query' , uploadProfilePic);

router.put('/update/profile/:query' , updateProfile);

router.get('/followings/:query' , userFollowings);

router.get('/landingPage/Bio' , landingPageBio)

module.exports = router;