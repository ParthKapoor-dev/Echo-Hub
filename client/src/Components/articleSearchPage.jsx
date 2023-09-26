import { useEffect, useState , useRef} from "react";
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";

import SavePng from "../../images/save.png"
import SaveFilledPng from "../../images/saveFilled.png"
import SaveGif from "../../images/save.gif"
import DotStaticPlain from "../../images/three dots static plain.png"
import DotStaticFilled from "../../images/three dots static filled.png"
import DotHover from "../../images/three dots hover.gif"
import ProfilePic from "../../images/profilePicture.png"

export default function ArticleSearchPage({ searchQuery }) {

    const { token } = useUserContext();
    const [Articles, setArticles] = useState([]);
    const [PageIsLoading , setPageIsLoading] = useState(true)

    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/search/articles/${searchQuery}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                }
            })
            const json = await response.json();

            if (response.ok) {
                console.log(json)
                setArticles(json);
                setPageIsLoading(false)
            } else {
                console.log(json);
            }
        }

        if (token && searchQuery) fetchingData();
    }, [token, searchQuery])

    return (
        <>
            {!PageIsLoading ? (
                        Articles.map(article=>(
                            <Article key={article._id} article={article}  />
                        ))
            ) : (
                <div className="PageisLoading-div">
                    Wait Page is Currently loading
                </div>
            )}
        </>
    )
}



function Article({ article, handleRemoveFromFeed }) {
    const profilePicture = article.profilePicture;
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
        <div className="article-searchPage-article">

            <div className="article-searchPage-article-accountDetails">
                {profilePicture ? <img src={profilePicture} /> : <img src={ProfilePic} />}
                <p className="article-searchPage-article-accountDetails-userName">
                    {article.userName}
                </p>
            </div>
            <h1 className="article-searchPage-article-title" onClick={handleArticlePage}>
                {article.title}
            </h1>
            <p className="article-searchPage-article-data">
                {article.article.split('').splice(0, 200)}...
            </p>

            <div className="article-searchPage-article-details">
                <div className="article-searchPage-article-tag">
                    tag
                </div>
                <div className="article-searchPage-article-save-div" onClick={handleSaveCLick} onMouseEnter={() => setSave(SaveGif)} onMouseLeave={() => setSave(() => {
                    if (user?.list.includes(article._id)) return SaveFilledPng;
                    return SavePng;
                })}>
                    <img src={save} />
                </div>
                <div className="article-searchPage-article-dots-div" >
                    <img src={dots} alt="settings" onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} />
                </div>
                <dialog ref={OptionsRef} className="article-searchPage-dialog">
                    <div className="article-searchPage-dialog-settingsAndEdit">
                        <p className="article-searchPage-dialog-muteAuthor">
                            Mute this author
                        </p>
                        <p className="article-searchPage-dialog-Report">
                            Report
                        </p>
                    </div>
                    <p className="article-searchPage-dialog-removeFromFeed" onClick={() => handleRemoveFromFeed(article._id)}>
                        Remove from feed
                    </p>    

                </dialog>
            </div>
        </div>
    )
}