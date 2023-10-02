const User = require('../model/userModel');
const Article = require('../model/articleModel');
const cloudinary = require('../utlis/cloudinary');
async function follow(req, res) {
    const { currentUserId, followedUserId } = req.body;

    try {
        const currentUser = await User.findOne({ _id: currentUserId });
        const followedUser = await User.findOne({ _id: followedUserId });
        if (currentUser.following.includes(followedUserId)) {
            throw Error({ message: 'This user is already being followed' })
        }
        if (followedUser.followers.includes(currentUserId)) {
            throw Error({ message: "This user is already following you" })
        }
        currentUser.following.push(followedUserId);
        followedUser.followers.push(currentUserId);

        await currentUser.save();
        await followedUser.save();

        res.json(followedUser)

    } catch (error) {
        res.json({ ErrorMessage: error.message })
    }
}
async function unfollow(req, res) {
    const { currentUserId, followedUserId } = req.body;

    try {
        const currentUser = await User.findOne({ _id: currentUserId });
        const followedUser = await User.findOne({ _id: followedUserId });
        if (!currentUser.following.includes(followedUserId)) {
            throw Error({ message: 'This user was never followed you' })
        }
        if (!followedUser.followers.includes(currentUserId)) {
            throw Error({ message: "This user was never following you" })
        }
        currentUser.following = currentUser.following.filter(item => item !== followedUserId);
        followedUser.followers = followedUser.followers.filter(item => item !== currentUserId);

        await currentUser.save();
        await followedUser.save();

        res.json(followedUser)

    } catch (error) {
        console.log(error)
        res.json({ ErrorMessage: error.message })
    }
}
async function Allusers(req, res) {

    try {
        const users = await User.find({});
        res.json(users)
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
}
async function UserProfile(req, res) {
    const userId = req.params.id

    try {
        const user = await User.findOne({ _id: userId });

        res.json(user)
    } catch (error) {
        console.log(error);
        res.json({ message: error.message })
    }
}
async function uploadProfilePic(req, res) {
    const userId = req.params.query;
    const profileImg = req.body.ProfileImage;
    try {

        const result = await cloudinary.uploader.upload(profileImg, {
            folder: "UserProfilePictures"
        })
        const user = await User.findOneAndUpdate({ _id: userId }, {
            profilePicture: {
                public_id: result.public_id,
                url: result.secure_url
            }
        }, { new: true });

        res.json(user);
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}
async function updateProfile(req, res) {
    const user = req.user;
    const { profilePicture, bio, name } = req.body;
    const updatedProfile = {};
    try {
        if (user.profilePicture.public_id !== "" && profilePicture !== undefined){
            await cloudinary.uploader.destroy(user.profilePicture.public_id);
            updatedProfile.profilePicture = {
                public_id : "",
                url : ""
            }
        }

        if (profilePicture) {
            const result = await cloudinary.uploader.upload(profilePicture, {
                folder: "UserProfilePicture"
            })
            updatedProfile.profilePicture = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }
        if (name) updatedProfile.name = name;
        if (bio) updatedProfile.bio = bio;

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id }, { ...updatedProfile }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.json({ message: error.message })
    }
}
async function userFollowings(req, res) {
    const userId = req.params.query;
    try {
        const followings = await User.findOne({ _id: userId }).select('following')
        const newFollowings = followings.following.slice(0, 5);
        // const finalFollowings = await Promise.all(newFollowings.map(
        //     async (_id) => await User.findOne({ _id }).select('name profilePicture')
        // ))

        async function getFollowingsById() {
            const users = [];

            for (const _id of newFollowings) {
                const user = await User.findOne({ _id }).select('name profilePicture');
                if (user) users.push(user);
            }

            return users;
        }

        const finalFollowings = await getFollowingsById();
        res.json(finalFollowings);
    } catch (error) {
        res.json({ message: error.message })
    }
}
async function landingPageBio(req, res) {
    console.log('hello ji')
    const user = req.user;
    const userId = user._id

    try {

        async function getLikedArticles(userId) {
            return await Article.find({ likes: userId });
        };

        async function getUsersByTags(tags) {
            const users = [];
            const articles = [];

            for (const tag of tags) {
                const taggedArticles = await Article.find({ tags: tag });
                for (const taggedArticle of taggedArticles) {
                    const user = await User.findOne({ _id: taggedArticle.userId });
                    if (user) {
                        users.push(user);
                        const article = await Article.findOne({ userId });
                        if (article) articles.push(article)
                    }
                }
            }

            return { users, articles };
        };

        const likedArticles = await getLikedArticles(userId);

        const tags = likedArticles.map((article) => article.tags);

        const LikedTaggedData = await getUsersByTags(tags);
        const LikedTagsAccounts = LikedTaggedData.users;
        const LikedTaggedArticles = LikedTaggedData.artilcles;

        res.json({ tags, LikedTagsAccounts, LikedTaggedArticles });
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    Allusers,
    follow,
    unfollow,
    UserProfile,
    uploadProfilePic,
    updateProfile,
    userFollowings,
    landingPageBio
}