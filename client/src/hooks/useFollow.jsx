import useUserContext from "./useUserContext";
import { useState , useEffect } from "react";

export default function useFollow(followedUserId){
    const { user , token , dispatch} = useUserContext();

    const [toggleFollow, setToggleFollow] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [jsonData , setJsonData ] = useState();

    useEffect(() => {
        if (user?.following?.includes(followedUserId)) setToggleFollow(true);
        else setToggleFollow(false);
    }, [user, followedUserId])

    async function follow(currentUserId, followedUserId) {
        const response = await fetch('https://echo-hub-server.onrender.com/accounts/follow', {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            },
            body: JSON.stringify({ currentUserId, followedUserId })
        })
        const json = await response.json();
    
        if (response.ok) {
            setJsonData(json);
            setIsLoading(false)
    
        } else {
            console.log(json);
        }
    }
    async function unfollow(currentUserId, followedUserId) {
        const response = await fetch('https://echo-hub-server.onrender.com/accounts/unfollow', {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            },
            body: JSON.stringify({ currentUserId, followedUserId })
        })
        const json = await response.json();
    
        if (response.ok) {
            setJsonData(json)
            setIsLoading(false)
        } else {
            console.log(json);
        }
    }
    
    async function handleFollowBtn() {
        const currentUserId = user._id;
    
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

    return { 
        handleFollowBtn , 
        isLoading , 
        toggleFollow , 
        jsonData
    }
}