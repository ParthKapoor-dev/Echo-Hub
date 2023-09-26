import ProfilePic from "../../images/profilePicture.png"

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUserContext from "../hooks/useUserContext";

export default function BioSectionExternalUser({ AccountDetails , setAccountDetails}){

    const { user, token, dispatch } = useUserContext();
    const [followings, setfollowings] = useState([]);
    const [toggleFollow, setToggleFollow] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const Navigate = useNavigate();

    useEffect(() => {
        if (user?.following?.includes(AccountDetails._id)) setToggleFollow(true);
        else setToggleFollow(false);
    }, [user, AccountDetails])

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
            setAccountDetails(json);
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
            setAccountDetails(json);
            setIsLoading(false)
        } else {
            console.log(json);
        }
    }

    async function handleFollowBtn(event) {
        event.preventDefault();
        const currentUserId = user._id;
        const followedUserId = AccountDetails._id;

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

        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/accounts/followings/${AccountDetails._id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                }
            })
            const json = await response.json();
            if (response.ok) {
                console.log(json)
                setfollowings(json)
            } else {
                console.log(json)
            }
        }
        if (token && user) fetchingData();
    }, [user, token , AccountDetails]);


    return (
        <div className="accountPage-Bio-section-div">
            {AccountDetails?.profilePicture ? (
                <img src={AccountDetails.profilePicture} className="accountPage-Bio-section-profileImage" />
            ) : (
                <img src={ProfilePic} className="accountPage-Bio-section-profileImage" />
            )}

            <div className="accountPage-Bio-section-userName">
                {AccountDetails?.name}
            </div>

            <div className="accountPage-Bio-section-followers-count">
                {AccountDetails.followers.length} {AccountDetails.followers.length == 1 ? "Follower" : "Followers"}
            </div>

            <div className="accountPage-Bio-section-myBio">
                {AccountDetails?.bio && AccountDetails.bio}
            </div>

            <button className={!toggleFollow ? ("accountPage-Bio-section-Follow-btn") : ("accountPage-Bio-section-Following-btn")} id="accountPage-Bio-section-toggleFollow-btn" disabled={isLoading} onClick={handleFollowBtn}>
                {toggleFollow && "Following"}
                {!toggleFollow && "Follow"}
            </button>
            

            <div className="accountPage-Bio-section-followings">
                <h4 className="accountPage-Bio-section-followings-header">Following</h4>
                {followings.length ? followings.map(item => (
                    <div key={item._id} className="accountPage-Bio-section-following-details" onClick={() => Navigate(`/user/account/${item._id}`, { state: { userId: item._id } })}>
                        {item.profilePicture ? (<img src={item.profilePicture} />) : (<img src={ProfilePic} />)}
                        {item.name}
                    </div>
                )) : "No Followings"}
            </div>


        </div>
    )
}
