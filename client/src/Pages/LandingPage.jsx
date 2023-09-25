import { useEffect, useRef, useState } from "react"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";

import SavePng from "../../images/save.png"
import SaveFilledPng from "../../images/saveFilled.png"
import SaveGif from "../../images/save.gif"
import DotStaticPlain from "../../images/three dots static plain.png"
import DotStaticFilled from "../../images/three dots static filled.png"
import DotHover from "../../images/three dots hover.gif"
import ProfilePic from "../../images/profilePicture.png"

export default function LandingPage() {

    const [Articles, setArticles] = useState([]);
    const [PageIsLoading, setPageIsLoading] = useState(true)
    const { user, token } = useUserContext();
    const [error, setError] = useState(null)
    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/article/feed/${user._id}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setArticles(json);
                setPageIsLoading(false)
            } else {
                console.log(json);
                setError(json.message)
            }
        }

        if (token && user) fetchingData();
    }, [user, token])

    function handleRemoveFromFeed(articleId){
        const newArticles = Articles.map(articleData=>(
            articleData.filter(article=>{
                if( !article?._id || article?._id !== articleId) {
                    return 1;
                }
                return 0;
            })
        ))
        setArticles(newArticles)
    }

    return (
        <>
            {!PageIsLoading ? (
                <div className="landingPage-div">
                    <div className="landingPage-content-section">
                        {Articles.map((articleData)=>{
                            const profilePicture = articleData[articleData.length -1];
                            return(
                                articleData.map((article,index)=>{
                                    if(index == articleData.length - 1) return
                                    return (
                                        <Article key={article._id} article={article} profilePicture={profilePicture} handleRemoveFromFeed={handleRemoveFromFeed} />
                                    )
                                })
                            )
                        })}
                    </div>

                </div>
            ) : (
                <div className="PageisLoading-div">
                    Wait Page is Currently loading
                    {error ?? (
                        <div className="error-div">{error}</div>
                    )}
                </div>
            )}
        </>

    )
}
function Article({ article ,profilePicture, handleRemoveFromFeed}) {
    const OptionsRef = useRef();
    const { user, token, dispatch } = useUserContext();
    const Navigate = useNavigate();
    const [save, setSave] = useState(() => {
        if (user?.list.includes(article._id)) return SaveFilledPng;
        return SavePng;
    });
    const [dots, setDots] = useState(DotStaticPlain);
    function handleMouseLeave() {
        if (dots == DotHover) setDots(DotStaticPlain)
    }
    function handleMouseEnter() {
        if (dots == DotStaticPlain) setDots(DotHover);
    }
    function handleMouseUp() {
        if (dots == DotStaticFilled) {
            setDots(DotStaticPlain);
            OptionsRef.current.style.transform = "translateY(-20%)";
            OptionsRef.current.style.opacity = 0;
            setTimeout(() => OptionsRef.current.close(), 250);
        }
        else {
            setDots(DotStaticFilled);
            OptionsRef.current.show();
            OptionsRef.current.style.opacity = 1;
            OptionsRef.current.style.transform = "translateY(0)";
        }

    }
    function handleArticlePage() {
        Navigate(`/article/${article.title}`, { state: { articleId: article._id } })
    }
    async function handleSaveCLick() {
        if (!user.list) return;
        function setUrl() {
            if (user?.list.includes(article._id)) return 'http://localhost:3000/article/list/remove'
            return 'http://localhost:3000/article/list/add'
        }
        const url = setUrl();
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user._id,
                articleId: article._id
            })
        });
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            setSave(() => {
                if (user?.list.includes(article._id)) return SaveFilledPng;
                return SavePng;
            })
            if (url === 'http://localhost:3000/article/list/add')
                dispatch({ type: 'ADDTOLIST', payload: article._id })
            else if (url == 'http://localhost:3000/article/list/remove')
                dispatch({ type: 'REMOVEFROMLIST', payload: article._id })
            else
                console.log('there is some error here')
        }
    }
    return (
        <div className="landingPage-article">

            <div className="landingPage-article-accountDetails">
                {profilePicture ? <img src={profilePicture} /> : <img src={ProfilePic} />}
                <p className="landingPage-article-accountDetails-userName">
                    {article.userName}
                </p>
            </div>
            <h1 className="landingPage-article-title" onClick={handleArticlePage}>
                {article.title}
            </h1>
            <p className="landingPage-article-data">
                {article.article.split('').splice(0, 200)}...
            </p>

            <div className="landingPage-article-details">
                <div className="landingPage-article-tag">
                    tag
                </div>
                <div className="landingPage-article-save-div" onClick={handleSaveCLick} onMouseEnter={() => setSave(SaveGif)} onMouseLeave={() => setSave(() => {
                    if (user?.list.includes(article._id)) return SaveFilledPng;
                    return SavePng;
                })}>
                    <img src={save} />
                </div>
                <div className="landingPage-article-dots-div" >
                    <img src={dots} alt="settings" onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} />
                </div>
                <dialog ref={OptionsRef} className="landingPage-article-dialog">
                    <div className="landingPage-article-dialog-settingsAndEdit">
                        <p className="landingPage-article-dialog-muteAuthor">
                            Mute this author
                        </p>
                        <p className="landingPage-article-dialog-Report">
                            Report
                        </p>
                    </div>
                    <p className="landingPage-article-dialog-removeFromFeed" onClick={()=>handleRemoveFromFeed(article._id)}>
                        Remove from feed
                    </p>

                </dialog>
            </div>
        </div>
    )
}