import {  useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import useUserContext from '../hooks/useUserContext';
export default function AccountProfilePage(){
    const location = useLocation();
    const userId = location.state.userId;
    const { user , token , dispatch}  = useUserContext();
    const [AccountDetails , setAccountDetails] = useState([]);
    const [toggleFollow , setToggleFollow] = useState();
    const [isLoading , setIsLoading] = useState(false);
    const [PageIsLoading , setPageIsLoading ] = useState(true);
    const Navigate = useNavigate();
    useEffect(()=>{
        async function fetchingData(){
            const response = await fetch(`http://localhost:3000/accounts/userProfile/${userId}`,{
                method: "GET",
                headers : {
                    'content-type' : 'application/json',
                    'authorization' : `bearer ${token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                setAccountDetails(json);
                setPageIsLoading(false)
                console.log(json)
            }else{
                console.log(json)
            }
        }
        if(token && user._id !== userId)   fetchingData()
        else if(user._id === userId) Navigate('/profile');
    },[token , userId , user])

    useEffect(()=>{
        if(user?.following?.includes(AccountDetails._id)) setToggleFollow(true);
        else setToggleFollow(false);
    },[user , AccountDetails])

    async function follow(currentUserId , followedUserId){
        const response = await fetch('http://localhost:3000/accounts/follow',{
            method:"PUT",
            headers:{
                'content-type':'application/json',
                'authorization': `bearer ${token}`
            },
            body:JSON.stringify({currentUserId , followedUserId})
        })
        const json = await response.json();

        if(response.ok){
            console.log(json);
            setAccountDetails(json);
            setIsLoading(false)

        }else{
            console.log(json);
        }
    }
    async function unfollow(currentUserId , followedUserId){
        const response = await fetch('http://localhost:3000/accounts/unfollow',{
            method:"PUT",
            headers:{
                'content-type':'application/json',
                'authorization': `bearer ${token}`
            },
            body:JSON.stringify({currentUserId , followedUserId})
        })
        const json = await response.json();

        if(response.ok){
            console.log(json);
            setAccountDetails(json);
            setIsLoading(false)
        }else{
            console.log(json);
        }
    }

    async function handleFollowBtn(event){
        event.preventDefault();
        const currentUserId = user._id;
        const followedUserId = AccountDetails._id;

        setIsLoading(true)

       if(toggleFollow){
        const following = user.following.filter((item)=>item !== followedUserId)
        setToggleFollow(false)
        await unfollow(currentUserId , followedUserId);
        dispatch({type:"FOLLOWUPDATE" , payload : following})
       }else{
        const following = [followedUserId , ...user.following];
        setToggleFollow(true)
        await follow(currentUserId , followedUserId);
        dispatch({type:"FOLLOWUPDATE" , payload : following})
       }

    }
        return(
            <>
            {!PageIsLoading && (
            <div className="accountPage-div">
                <p className="accountPage-name">
                    {AccountDetails.name}
                </p>
                <p className="accountPage-followers">
                    Followers : {AccountDetails?.followers?.length}
                </p>
                <p className="accountPage-following">
                    Following : {AccountDetails?.following?.length}
                </p>
    
                <button className="toggleFollow-btn" disabled={isLoading} onClick={handleFollowBtn}>
                    {toggleFollow &&  "Unfollow"}
                    {!toggleFollow && "follow"}
                </button>
                {isLoading && (
                    <div className="isLoading-div">
                        please wait for response
                    </div>
                )}
            </div>)}
            {PageIsLoading && (
                <div className="pageisloading-div">This Page is Loading</div>
            )}
            </>
        )
    
}