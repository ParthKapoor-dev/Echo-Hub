import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import useUserContext from "../hooks/useUserContext"
import useFollow from "../hooks/useFollow";

import ProfilePic from "/images/profilePicture.png"
import LoadingPageGif from "/images/Loading Page animation1.gif"
import { CurrentMode } from "../../currentMode";


export default function UserSearchPage({ setTags }) {
    const location = useLocation();
    const searchQuery = location.state;
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { token } = useUserContext();
    const [UserAccounts, setUserAccounts] = useState([]);

    useEffect(() => {
        async function fetchingData() {
            const url = CurrentMode.serverUrl + `/search/user/${searchQuery}` 
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                }
            })
            const json = await response.json();
            if (response.ok) {
                console.log(json)
                setUserAccounts(json.relatedUsers);
                setTags(json.relatedTags)
            } else {
                console.log(json);
            }
        }

        if (token && searchQuery) fetchingData();
    }, [token, searchQuery, setTags])

    return (
        isPageLoading ? (
            <div className="user-searchPage-div">
                {UserAccounts.length ? UserAccounts.map(account => (
                    <Account key={account._id} userAccount={account} setUserAccounts={setUserAccounts} />
                )) : (
                    <div className="user-seachPage-no-Users">
                        No users of This user name were found
                    </div>
                )}
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


function Account({ userAccount, setUserAccounts }) {
    const { user } = useUserContext();
    const Navigate = useNavigate();

    const { handleFollowBtn, toggleFollow, isLoading, jsonData } = useFollow(userAccount._id);

    async function handleFollowedBtn(event) {
        event.preventDefault();
        await handleFollowBtn();

        if (!isLoading && jsonData?._id == userAccount?._id)
            setUserAccounts(prevData => prevData.map(account => {
                if (account._id == jsonData._id) return jsonData;
                return account;
            }));
    }


    function handleuserprofile() {
        Navigate(`/user/account/${userAccount.name}`, { state: { userId: userAccount._id } })
    }
    return (
        <div className="user-searchPage-account-div">

            {userAccount.profilePicture.url !== "" ? (
                <img src={userAccount.profilePicture.url} />
            ) : (
                <img src={ProfilePic} />
            )}

            <div className="user-searchPage-account-details-div">
                <h4 className="user-searchPage-account-name" onClick={handleuserprofile}>
                    {userAccount.name}
                </h4>
                <p className="user-searchPage-account-bio">
                    {userAccount.bio}
                </p>
            </div>

            {userAccount._id !== user._id && (
                <button className={!toggleFollow ? ("accountPage-Bio-section-Follow-btn") : ("accountPage-Bio-section-Following-btn")} id="accountPage-Bio-section-toggleFollow-btn" disabled={isLoading} onClick={handleFollowedBtn}>
                    {toggleFollow && "Following"}
                    {!toggleFollow && "Follow"}
                </button>
            )}

        </div>
    )
}