import ProfilePic from "/images/profilePicture.png"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserContext from "../hooks/useUserContext";
import useFollow from "../hooks/useFollow";

export default function BioSectionExternalUser({ AccountDetails , setAccountDetails}){

    const { user, token} = useUserContext();
    const [followings, setfollowings] = useState([]);
    const Navigate = useNavigate();
    const {handleFollowBtn , toggleFollow , isLoading , jsonData} = useFollow(AccountDetails._id);

    async function handleFollowedBtn(event){
        event.preventDefault();
        await handleFollowBtn();

        if(!isLoading && jsonData?._id == AccountDetails?._id) 
            setAccountDetails(jsonData);
    }

    

    useEffect(() => {

        async function fetchingData() {
            const response = await fetch(`https://echo-hub-server.onrender.com/accounts/followings/${AccountDetails._id}`, {
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
            {AccountDetails?.profilePicture.url !== "" ? (
                <img src={AccountDetails.profilePicture.url} className="accountPage-Bio-section-profileImage" />
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

            <button className={!toggleFollow ? ("accountPage-Bio-section-Follow-btn") : ("accountPage-Bio-section-Following-btn")} id="accountPage-Bio-section-toggleFollow-btn" disabled={isLoading} onClick={handleFollowedBtn}>
                {toggleFollow && "Following"}
                {!toggleFollow && "Follow"}
            </button>
            

            <div className="accountPage-Bio-section-followings">
                <h4 className="accountPage-Bio-section-followings-header">Following</h4>
                {followings.length ? followings.map(item => (
                    <div key={item._id} className="accountPage-Bio-section-following-details" onClick={() => Navigate(`/user/account/${item._id}`, { state: { userId: item._id } })}>
                        {item.profilePicture.url !== "" ? (<img src={item.profilePicture.url} />) : (<img src={ProfilePic} />)}
                        {item.name}
                    </div>
                )) : "No Followings"}
            </div>


        </div>
    )
}
