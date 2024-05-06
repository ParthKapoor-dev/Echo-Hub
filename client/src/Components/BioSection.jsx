import ProfilePic from "/images/profilePicture.png"
import CancelPng from "/images/cancel.png"

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUserContext from "../hooks/useUserContext";
import { CurrentMode } from "../../currentMode";
export default function BioSection() {

    const { user, token, dispatch } = useUserContext();
    const [followings, setfollowings] = useState([]);
    const editProfileRef = useRef();
    const Navigate = useNavigate();

    console.log(user)

    useEffect(() => {

        async function fetchingData() {
            const url = CurrentMode.serverUrl + `/accounts/followings/${user._id}`
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
                setfollowings(json)
            } else {
                console.log(json)
            }
        }
        if (token && user) fetchingData();
        console.log(user)
    }, [user, token]);


    async function handleProfilePictureUpdate(event) {
        const file = event?.target?.files[0];
        const base64File = await ConvertToBase64(file);
        console.log(base64File);
        if (file) {
            const url = CurrentMode.serverUrl + `/accounts/upload/profilePic/${user._id}`
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ProfileImage: base64File
                })
            });
            const json = await response.json();

            if (response.ok) {
                console.log(json);
                dispatch({ type: 'PROFILEPICUPDATE', payload: json })
            } else {
                console.log(json);
            }
        }
    }



    async function ConvertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    return (
        <div className="userPage-Bio-section-div">
            <div className="userPage-Bio-section-personal-details">

                {user?.profilePicture?.url ? (
                    <img src={user.profilePicture.url} className="userPage-Bio-section-profileImage" />
                ) : (
                    <form>
                        <input type="file" id="userPage-profilePicture" accept="image/*" onChange={handleProfilePictureUpdate} />
                        <label htmlFor="userPage-profilePicture">
                            <img src={ProfilePic} className="userPage-Bio-section-profileImage" />
                        </label>
                    </form>
                )}
                <div>

                    <div className="userPage-Bio-section-userName">
                        {user?.name}
                    </div>

                    <div className="userPage-Bio-section-followers-count">
                        {user?.followers?.length} {user.followers.length == 1 ? "Follower" : "Followers"}
                    </div>
                </div>

            </div>

            <div className="userPage-Bio-section-myBio">
                {(user?.bio) ? (
                    user?.bio
                ) : (
                    <div className="userPage-Bio-section-myBio-reminder">
                        Edit your Bio
                    </div>
                )}
            </div>

            <div className="userPage-Bio-section-myBio-edit" onClick={() => editProfileRef.current.showModal()}>
                Edit Profile
            </div>

            <div className="userPage-Bio-section-followings">
                <h4 className="userPage-Bio-section-followings-header">Following</h4>
                {followings.length && followings.map(item => (
                    <div key={item._id} className="userPage-Bio-section-following-details" onClick={() => Navigate(`/user/account/${item._id}`, { state: { userId: item._id } })}>
                        {item.profilePicture ? (<img src={item.profilePicture.url} />) : (<img src={ProfilePic} />)}
                        {item.name}
                    </div>
                ))}
            </div>

            <EditProfile ConvertToBase64={ConvertToBase64} editProfileRef={editProfileRef} />

        </div>
    )
}

function EditProfile({ ConvertToBase64, editProfileRef }) {

    const { user, token, dispatch } = useUserContext();
    const editProfileSaveRef = useRef();

    const [editProfileImg, setEditProfileImg] = useState(() => {
        if (user.profilePicture.url !== "") return user.profilePicture.url;
        if (user) return ProfilePic
        return ""
    })
    const [editProfileName, setEditProfileName] = useState(() => {
        if (user) return user.name;
        return ""
    })
    const [editProfileBio, setEditProfileBio] = useState(() => {
        if (user) return user.bio;
        return ""
    })
    useEffect(() => {
        if (user) {
            setEditProfileBio(user.bio || "");
            setEditProfileName(user.name || "")
            setEditProfileImg(user.profilePicture.url || ProfilePic)
        }
    }, [user])
    async function handleSaveProfile(event) {
        event.preventDefault();
        const updatedProfile = {};
        if (editProfileBio !== user.bio) updatedProfile.bio = editProfileBio;
        if (editProfileName !== user.name) updatedProfile.name = editProfileName;
        if (editProfileImg === ProfilePic) updatedProfile.profilePicture = null;
        else if (editProfileImg !== user.profilePicture) updatedProfile.profilePicture = editProfileImg;
        const url = CurrentMode.serverUrl + `/accounts/update/profile/${user._id}`
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedProfile)
        });
        const json = await response.json();

        if (response.ok) {
            console.log("mera naam joker")
            console.log(json);
            dispatch({ type: "UPDATEPROFILE", payload: json });
            handleEditProfileClose();
            editProfileSaveRef.current.disabled = handleSaveButtonDisabled();
        } else {
            console.log(json);
        }
    }

    async function handleProfileImageChange(event) {
        const file = event.target.files[0];
        const base64 = await ConvertToBase64(file);
        setEditProfileImg(base64);
    }
    async function handleProfileImageRemove() {
        setEditProfileImg(ProfilePic);
    }
    function handleEditProfileClose(event) {
        if (event) event.preventDefault();
        if (user?.bio) setEditProfileBio(user.bio);
        else setEditProfileBio("");
        editProfileRef.current.close();
    }
    function handleSaveButtonDisabled() {
        if (!user) return true;
        if (editProfileBio == user.bio && editProfileName == user.name && editProfileImg == user.profilePicture.url) return true;
        return false;
    }

    return (
        <dialog ref={editProfileRef} className="userPage-Bio-section-editProfile-dialogBox">
            <div className="userPage-Bio-section-editProfile-Heading">
                <h2>Profile Information</h2>
                <button onClick={handleEditProfileClose}>
                    <img src={CancelPng} alt="X" />
                </button>
            </div>
            <form className="userPage-Bio-section-editProfile-dialogBox-form">
                <div className="editProfile-Image-div">
                    <p className="editProfile-Image-heading">
                        Photo
                    </p>
                    <div className="editProfile-Image-container">
                        <img src={editProfileImg} />
                        <div className="editProfile-btns-container">

                            <input type="file" id="editProfile-Image" accept="image/*" onChange={handleProfileImageChange} />

                            <label htmlFor="editProfile-Image">
                                Update
                            </label>

                            <p className="editProfile-Image-remove" onClick={handleProfileImageRemove}>
                                Remove
                            </p>
                        </div>

                    </div>
                </div>

                <div className="editProfile-name-div">
                    <p className="editProfile-name-heading">
                        Name*
                    </p>
                    <input type="text" id="editProfile-name" value={editProfileName} onChange={(e) => setEditProfileName(e.target.value)} />
                    <p className="editProfile-name-details">
                        Appears on your Profile page, as your byline, and in your responses.
                    </p>
                </div>

                <div className="editProfile-bio-div">
                    <p className="editProfile-bio-heading">
                        Bio
                    </p>
                    <input type="text" id="editProfile-bio" value={editProfileBio} onChange={(e) => setEditProfileBio(e.target.value)} />
                    <p className="editProfile-bio-details">
                        Appears on your Profile and next to your stories.
                    </p>
                </div>

                <div className="editPage-buttons-div">
                    <button className="editPage-cancel-button" onClick={handleEditProfileClose}>
                        Cancel
                    </button>
                    <button className="editPage-save-button" disabled={handleSaveButtonDisabled()} ref={editProfileSaveRef} onClick={handleSaveProfile} >
                        Save
                    </button>
                </div>

            </form>
        </dialog>
    )
}