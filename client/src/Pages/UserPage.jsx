import { useEffect, useState } from "react";
import useUserContext from "../hooks/useUserContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import BioSection from "../Components/BioSection";
import UserArticle from "../Components/UserArticle";


import LoadingPageGif from "/images/Loading Page animation1.gif"
import { CurrentMode } from "../../currentMode";

export default function UserPage() {
    const { user, token } = useUserContext();
    const [userArticles, setUserArticles] = useState([]);
    const [error, seterror] = useState(null);
    const [PageIsLoading, setPageIsLoading] = useState(true);

    const Navigate = useNavigate();


    async function fetchingData() {
        const url = CurrentMode.serverUrl + `/article/user/${user._id}` 
        const response = await fetch(url, {
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
    async function handleDeleteArticle(event, _id) {
        event.preventDefault();
        const url = CurrentMode.serverUrl + '/article'
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ _id })
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



function Home({ userArticles, deleteFunction }) {

    return (
        <div className="userPage-Home-div">
            {userArticles.map(article => (
                <UserArticle key={article._id} article={article} deleteFunction={deleteFunction} />
            ))}
        </div>
    )
}
function Lists() {
    const { user, token } = useUserContext();
    const [list, setList] = useState([]);

    useEffect(() => {
        async function fetchingData() {
            const url = CurrentMode.serverUrl + `/article/list/${user._id}` 
            const response = await fetch(url, {
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
                        <UserArticle article={article[0]} key={article[0]._id} />
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

function About() {

}