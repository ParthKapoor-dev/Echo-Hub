import { useEffect, useState, useRef } from "react";
import useUserContext from "../hooks/useUserContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import BioSection from "../Components/BioSection";

import SavePng from "../../images/save.png"
import SaveFilledPng from "../../images/saveFilled.png"
import SaveGif from "../../images/save.gif"
import DotStaticPlain from "../../images/three dots static plain.png"
import DotStaticFilled from "../../images/three dots static filled.png"
import DotHover from "../../images/three dots hover.gif"

export default function UserPage() {
    const { user, token } = useUserContext();
    const [userArticles, setUserArticles] = useState([]);
    const [error, seterror] = useState(null);
    const [PageIsLoading, setPageIsLoading] = useState(true);


    const Navigate = useNavigate();


    async function fetchingData() {
        const response = await fetch('http://localhost:3000/article', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            }
        })
        const json = await response.json();
        if (response.ok) {
            setUserArticles(json);
            setPageIsLoading(false)
        } else {
            console.log(json)
            seterror(json.message)
        }
    }
    async function handleDeleteArticle(event, userId, _id) {
        event.preventDefault();
        const response = await fetch('http://localhost:3000/article/', {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, _id })
        });
        const json = await response.json();

        if (response.ok) {
            fetchingData();
        } else {
            console.log(json)
        }

    }
    useEffect(() => {
        if (token) fetchingData();
    }, [user, token]);

    return (
        <>
            {!PageIsLoading ? (
                <div className="userPage-div">
                    <div className="userPage-content-section">
                        <h3 className="UserPage-userName">{user?.name} </h3>

                        <div className="userPage-routes">
                            <p className="userPage-Home-route" onClick={() => Navigate('/profile')}>Home</p>
                            <p className="userPage-Lists-route" onClick={() => Navigate('/profile/Lists')}>Lists</p>
                            <p className="userPage-About-route" onClick={() => Navigate('/profile/About')}>About</p>
                        </div>

                        <Routes>
                            <Route path="/" element={<Home userArticles={userArticles} deleteFunction={handleDeleteArticle} />} />
                            <Route path="/Lists" element={<Lists />} />
                            <Route path="/About" element={<About />} />
                        </Routes>

                    </div>

                    <BioSection />
                    {error && <div className="error-div">{error}</div>}
                </div>
            ) : (
                <div className="PageIsLoading-div">
                    This Page is currently loading
                </div>
            )}
        </>
    )
}



function Home({ userArticles, deleteFunction }) {

    return (
        <div className="UserPage-Articles-div">
            {userArticles.map(article => (
                <Article key={article._id} article={article} />
            ))}
        </div>
    )
}
function Lists() {
    const { user, token } = useUserContext();
    const [list, setList] = useState([]);

    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/article/list/${user._id}`, {
                method: "GET",
                headers: {
                    'content-type': `application/json`,
                    'authorization': `Bearer ${token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                console.log(json)
                setList(json)
            }
            else {
                console.log(json);
            }
        }

        if (token && user) fetchingData();
    }, [token, user])

    console.log(list);
    return (
        <>
            {list.length ? (
                <div className="userPage-lists-div">
                    {list.map(article => (
                        <Article article={article[0]} key={article[0]._id} />
                    ))}
                </div>
            ) : (
                <div className="userPage-lists-empty-div">
                    You have an empty list
                </div>
            )}
        </>
    )
}

function Article({ article }) {
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
        if (dots == DotStaticFilled) setDots(DotStaticPlain);
        else setDots(DotStaticFilled);
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
        <div className="userPage-article">
            <h1 className="userPage-article-title" onClick={handleArticlePage}>
                {article.title}
            </h1>
            <p className="userPage-article-data">
                {article.article.split('').splice(0, 150)}...
            </p>

            <div className="userPage-article-details">
                <div className="userPage-article-tag">
                    tag
                </div>
                <div className="userPage-article-save-div" onClick={handleSaveCLick} onMouseEnter={() => setSave(SaveGif)} onMouseLeave={() => setSave(() => {
                    if (user?.list.includes(article._id)) return SaveFilledPng;
                    return SavePng;
                })}>
                    <img src={save} />
                </div>
                <div className="userPage-article-dots-div" >
                    <img src={dots} alt="settings" onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} />
                </div>
            </div>
        </div>
    )
}

function About() {

}