import { useEffect, useState } from 'react';
import { useLocation, useNavigate , Route , Routes } from 'react-router-dom'
import useUserContext from '../hooks/useUserContext';
import BioSectionExternalUser from "../Components/BioSection-externalUser";

import SavePng from "../../images/save.png"
import SaveFilledPng from "../../images/saveFilled.png"
import SaveGif from "../../images/save.gif"
import DotStaticPlain from "../../images/three dots static plain.png"
import DotStaticFilled from "../../images/three dots static filled.png"
import DotHover from "../../images/three dots hover.gif"
import ExternalUserArticle from '../Components/UserArticle-External';


export default function AccountProfilePage() {
    const location = useLocation();
    const userId = location.state.userId;
    const { user, token, dispatch } = useUserContext();
    const [AccountDetails, setAccountDetails] = useState([]);
    const [PageIsLoading, setPageIsLoading] = useState(true);
    const Navigate = useNavigate();
    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/accounts/userProfile/${userId}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setAccountDetails(json);
                setPageIsLoading(false)
                console.log(json)
            } else {
                console.log(json)
            }
        }
        if (token && user._id !== userId) fetchingData()
        else if (user?._id === userId) Navigate('/profile');
    }, [token, userId, user])

    
    return (
        <>
            {!PageIsLoading ? (
                <div className="accountPage-div">
                    <div className="accountPage-content-section">
                        <h3 className="accountPage-userName">
                            {AccountDetails?.name} 
                        </h3>

                        <div className="accountPage-routes">
                            <p className="accountPage-Home-route" onClick={() => Navigate(`/user/account/${AccountDetails._id}`,{state:{userId : AccountDetails._id}})}>Home</p>
                            <p className="accountPage-Lists-route" onClick={() => Navigate(`/user/account/${AccountDetails._id}/Lists`,{state:{userId : AccountDetails._id}})}>Lists</p>
                            <p className="accountPage-About-route" onClick={() => Navigate(`/user/account/${AccountDetails._id}/About`,{state:{userId : AccountDetails._id}})}>About</p>
                        </div>

                        <Routes>
                            <Route path="/" element={<Home AccountDetails={AccountDetails} />} />
                            <Route path="/Lists" element={<Lists AccountDetails={AccountDetails}/>} />
                            <Route path="/About" element={<About />} />
                        </Routes>

                    </div>

                    <BioSectionExternalUser  AccountDetails={AccountDetails} setAccountDetails={setAccountDetails}/>
                </div>
            ) : (
                <div className="PageIsLoading-div">
                    This Page is currently loading
                </div>
            )}
        </>
    )

}


function Home({AccountDetails}) {
    const [userArticles , setUserArticles] = useState([]);
    const { token } = useUserContext();

    useEffect(()=>{
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/article/user/${AccountDetails._id}`, {
                method: "GET",
                headers: {
                    'content-type': `application/json`,
                    'authorization': `Bearer ${token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                console.log(json)
                setUserArticles(json)
            }
            else {
                console.log(json);
            }
        }

        if (AccountDetails._id && token){
            fetchingData();
            console.log(AccountDetails)
        }
    },[AccountDetails , token])

    return (
        <div className="accountPage-Home-div">
        { userArticles?.length && userArticles.map(article => (
            <ExternalUserArticle key={article._id} article={article} profilePicture={AccountDetails.profilePicture} />
        ))}
    </div>
    )
}
function Lists({AccountDetails}) {
    const { token } = useUserContext();
    const [list, setList] = useState([]);

    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/article/list/${AccountDetails._id}`, {
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

        if (token && AccountDetails._id) fetchingData();
    }, [token, AccountDetails])

    console.log(list);
    return (
        <>
            {list.length ? (
                <div className="accountPage-lists-div">
                    {list.map(article => (
                        <ExternalUserArticle article={article[0]} key={article[0]._id} />
                    ))}
                </div>
            ) : (
                <div className="accountPage-lists-empty-div">
                    You have an empty list
                </div>
            )}
        </>
    )
}

function About() {

}