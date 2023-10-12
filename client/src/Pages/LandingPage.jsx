import { useEffect, useState } from "react"
import useUserContext from "../hooks/useUserContext"
import ExternalUserArticle from "../Components/UserArticle-External";

import LoadingPageGif from "../../images/Loading Page animation1.gif"
import ProfilePic from "../../images/profilePicture.png"
import useFollow from "../hooks/useFollow";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

    const [Articles, setArticles] = useState([]);
    const [ recommendedAccounts , setRecommendedAccounts ] = useState([]);
    const [ recommendedTags , setRecommendedTags ] = useState([]);
    const [PageIsLoading, setPageIsLoading] = useState(true)
    const { user, token } = useUserContext();
    const [error, setError] = useState(null)
    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/article/feed`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                console.log(json)
                setArticles(json.finalArticles);
                setRecommendedAccounts(json.finalAccounts);
                setRecommendedTags(json.LikedTags);
                setPageIsLoading(false)
            } else {
                console.log(json);
                setError(json.message)
            }
        }

        if (token && user) fetchingData();
    }, [user, token])

    // function handleRemoveFromFeed(articleId) {
    //     const newArticles = Articles.map(articleData => (
    //         articleData.filter(article => {
    //             if (!article?._id || article?._id !== articleId) {
    //                 return 1;
    //             }
    //             return 0;
    //         })
    //     ))
    //     setArticles(newArticles)
    // }

    return (
        <>
            {!PageIsLoading ? (
                <div className="landingPage-div">
                    <div className="landingPage-content-section">
                        {Articles.length && Articles.map(article => (
                            <ExternalUserArticle key={article._id} article={article} />
                        ))}
                    </div>

                    <BioSection likedTags={recommendedTags} likedTagsAccounts={recommendedAccounts} />

                </div>
            ) : (
                <div className="PageisLoading-div">
                    <img src={LoadingPageGif} />
                    {error ?? (
                        <div className="error-div">{error}</div>
                    )}
                </div>
            )}
        </>

    )
}

function BioSection( { likedTags , likedTagsAccounts }) {
    return (
        <div className="landingPage-Bio-Section">

            {/* <div className="landingPage-StaffPicks">
                <p className="landingPage-StaffPicks-headings">
                    Staff Picks
                </p>
            </div> */}

            <div className="landingPage-Recommended-tags">
                <p className="landingPage-Recommended-tags-headings">
                    Recommended Tags
                </p>

                <div className="landingPage-Recommended-tags-div">
                    {likedTags.map(tag => (
                        <div key={tag} className="landingPage-recommended-tag">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>

            <div className="landingPage-whoToFollow">
                <p className="landingPage-whoToFollow-heading">
                    Who To follow
                </p>

                <div className="landingPage-whoToFollow-div">
                    {likedTagsAccounts.map(account => (
                        <WhoToFollow key={account._id} account={account} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function WhoToFollow({ account }) {

    const Navigate = useNavigate();
    const { handleFollowBtn, toggleFollow, isLoading } = useFollow(account._id);
    function handleUserAccountPage(){
        Navigate('/user/account/'+ account._id , {state : {userId : account._id}} )
    }

    return (
        <div key={account._id} className="landingPage-whoToFollow-account">
            {account.profilePicture.url !== "" ? (
                <img src={account.profilePicture.url} onClick={handleUserAccountPage} />
            ) : (
                <img src={ProfilePic} onClick={handleUserAccountPage} />
            )}
            <div className="landingPage-whoToFollow-account-userDetails" onClick={handleUserAccountPage}>
                <p className="userDetails-name">
                    {account.name}
                </p>
                <p className="userDetails-bio">
                    {account.bio.split('').slice(0, 48)}...
                </p>
            </div>
            <button className={!toggleFollow ? ("articlePage-Bio-section-Follow-btn") : ("articlePage-Bio-section-Following-btn")} id="articlePage-Bio-section-toggleFollow-btn" disabled={isLoading} onClick={handleFollowBtn}>
                {toggleFollow && "Following"}
                {!toggleFollow && "Follow"}
            </button>
        </div>
    )
}