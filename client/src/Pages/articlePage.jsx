import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import useUserContext from "../hooks/useUserContext";
import useFollow from "../hooks/useFollow";
import CommentsDialog from "../Components/CommentsDialog";


import LoadingPageGif from "/images/Loading Page animation1.gif"
import ProfilePic from "/images/profilePicture.png"
import LikeStaticPlain from "/images/likeStaticPlain.png"
import LikeStaticFilled from "/images/likeStaticFilled.png"
import LikeGif from "/images/likegif.gif"
import CommentsPng from "/images/commentsPng.png"
import CommentsGif from "/images/commentsGif.gif"
import { CurrentMode } from "../../currentMode";


export default function ArticlePage() {
    const location = useLocation();
    const articleId = location.state.articleId;
    const Navigate = useNavigate();
    const { user, token } = useUserContext();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [articleData, setarticleData] = useState([]);
    const commentDialogRef = useRef();
    const [Liked, setLiked] = useState(() => {
        if (articleData?.likes?.includes(user?._id)) return true;
        return false
    })
    const [LikeHover, setLikeHover] = useState(false);
    const [commentHover, setCommentHover] = useState(false);

    const { handleFollowBtn, toggleFollow, isLoading } = useFollow(articleData.userId);

    useEffect(() => {
        if (user) {
            if (articleData?.likes?.includes(user?._id)) setLiked(true);
            else false
        }
    }, [user, articleData])

    const dateArray = articleData.date?.split(' ');
    const date = () => {
        if (dateArray) return dateArray[1] + " " + dateArray[2];
        return null
    }

    async function handleLike() {
        const url = CurrentMode.serverUrl + '/article/like'
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ articleId: articleData._id })
        });
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            setarticleData((prev) => {
                const newarticle = { ...prev, likes: json.likes };
                console.log(newarticle);
                return newarticle;
            })
            setLiked(() => {
                if (json.likes.includes(user._id)) return true;
                return false;
            })
        } else {
            console.log(json)
        }
    }

    useEffect(() => {
        async function fetchingData() {
            const url = CurrentMode.serverUrl + `/article/${articleId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                console.log(json)
                const newArticle = json.article.replace(/\n/g, "<br>");
                json.article = newArticle;
                setarticleData(json);
                setIsPageLoading(false);
            } else {
                console.log(json)
            }
        }

        if (token && articleId) fetchingData();
    }, [articleId, token])

    function handleCommentSection() {
        commentDialogRef.current.showModal();
        commentDialogRef.current.style.transform = "translateX(0)"
    }

    function handleUserPage(){
        Navigate('/user/account/' +  articleData.userName , { state : { userId : articleData.userId}})
    }

    return (
        !isPageLoading ? (

            <div className="articlePage-div">

                <h1 className="articlePage-title">
                    {articleData.title}
                </h1>

                <div className="articlePage-user-details">

                    {articleData.userProfilePicture && articleData?.userProfilePicture?.url !== "" ? (
                        <img src={articleData.userProfilePicture.url} />
                    ) : (
                        <img src={ProfilePic} />
                    )}

                    <div className="articlePage-InnerDetails">
                        <div>
                            <p className="articlePage-InnerDetails-userName" onClick={handleUserPage}>
                                {articleData.userName} ·
                            </p>

                            <button className={!toggleFollow ? ("articlePage-Bio-section-Follow-btn") : ("articlePage-Bio-section-Following-btn")} id="articlePage-Bio-section-toggleFollow-btn" disabled={isLoading} onClick={handleFollowBtn}>
                                {toggleFollow && "Following"}
                                {!toggleFollow && "Follow"}
                            </button>
                        </div>
                        <p className="articlePage-innerDetails-date">
                            {date() && date()}
                        </p>
                    </div>
                </div>



                <div className="articlePage-actions-div">
                    <div className="articlePage-likes-and-comments">
                        <p className="articlePage-likes" onClick={handleLike} onMouseEnter={() => setLikeHover(true)} onMouseLeave={() => setLikeHover(false)}>
                            {!LikeHover ? (
                                Liked ? (
                                    <img src={LikeStaticFilled} />
                                ) : (
                                    <img src={LikeStaticPlain} />
                                )
                            ) : (
                                <img src={LikeGif} />
                            )}
                            {articleData.likes && articleData.likes.length}
                        </p>
                        <p className="articlePage-comments" onClick={handleCommentSection} onMouseEnter={() => setCommentHover(true)} onMouseLeave={() => setCommentHover(false)}>
                            {!commentHover ? (
                                <img src={CommentsPng} />
                            ) : (
                                <img src={CommentsGif} />
                            )}
                            {articleData.comments && articleData.comments.length}
                        </p>
                    </div>
                </div>
                <CommentsDialog articleData={articleData} commentDialogRef={commentDialogRef} setarticleData={setarticleData} />
                <div className="articlePage-article-div" dangerouslySetInnerHTML={{ __html: articleData.article }} />

            </div>
        ) : (
            <div className="PageisLoading-div">
                <img src={LoadingPageGif} />
                {/* {error ?? (
                <div className="error-div">{error}</div>
            )} */}
            </div>
        )
    )
}