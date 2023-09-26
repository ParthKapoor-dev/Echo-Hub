import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import useUserContext from "../hooks/useUserContext"

import ProfilePic from "../../images/profilePicture.png"

export default function UserSearchPage({ searchQuery }) {

    const { token } = useUserContext();
    const [UserAccounts, setUserAccounts] = useState([]);


    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/search/user/${searchQuery}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                }
            })
            const json = await response.json();

            if (response.ok) {
                setUserAccounts(json)
            } else {
                console.log(json);
            }
        }

        if (token && searchQuery) fetchingData();
    }, [token, searchQuery])

    return (
        <div className="user-searchPage-div">
            { UserAccounts.length ? UserAccounts.map(account => (
                <Account key={account._id} userAccount={account} setUserAccounts={setUserAccounts} />
            )) : (
                <div className="user-seachPage-no-Users">
                    No users of This user name were found
                </div>
            )}
        </div>
    )
}


function Account({ userAccount , setUserAccounts }) {
    const {user , dispatch , token} = useUserContext();
    const Navigate = useNavigate();
    const [toggleFollow, setToggleFollow] = useState();
    const [isLoading, setIsLoading] = useState(false);

    async function follow(currentUserId, followedUserId) {
        const response = await fetch('http://localhost:3000/accounts/follow', {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            },
            body: JSON.stringify({ currentUserId, followedUserId })
        })
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            setUserAccounts(prev=>prev.map(item=>{
                if(item._id == userAccount._id ) return json;
                return item;
            }))
            setIsLoading(false)

        } else {
            console.log(json);
        }
    }
    async function unfollow(currentUserId, followedUserId) {
        const response = await fetch('http://localhost:3000/accounts/unfollow', {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            },
            body: JSON.stringify({ currentUserId, followedUserId })
        })
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            setUserAccounts(prev=>prev.map(item=>{
                if(item._id == userAccount._id ) return json;
                return item;
            }))
            setIsLoading(false)
        } else {
            console.log(json);
        }
    }

    async function handleFollowBtn(event) {
        event.preventDefault();
        const currentUserId = user._id;
        const followedUserId = userAccount._id;

        setIsLoading(true)

        if (toggleFollow) {
            const following = user.following.filter((item) => item !== followedUserId)
            setToggleFollow(false)
            await unfollow(currentUserId, followedUserId);
            dispatch({ type: "FOLLOWUPDATE", payload: following })
        } else {
            const following = [followedUserId, ...user.following];
            setToggleFollow(true)
            await follow(currentUserId, followedUserId);
            dispatch({ type: "FOLLOWUPDATE", payload: following })
        }

    }

    useEffect(() => {
        if (user?.following?.includes(userAccount._id)) setToggleFollow(true);
        else setToggleFollow(false);
    }, [user, userAccount])
    function handleuserprofile() {
        Navigate(`/user/account/${userAccount.name}`, { state: { userId: userAccount._id } })
    }
    return (
        <div className="user-searchPage-account-div">

            {userAccount.profilePicture ? (
                <img src={userAccount.profilePicture} />
            ):(
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
                <button className={!toggleFollow ? ("accountPage-Bio-section-Follow-btn") : ("accountPage-Bio-section-Following-btn")} id="accountPage-Bio-section-toggleFollow-btn" disabled={isLoading} onClick={handleFollowBtn}>
                {toggleFollow && "Following"}
                {!toggleFollow && "Follow"}
            </button>
            )}

        </div>
    )
}