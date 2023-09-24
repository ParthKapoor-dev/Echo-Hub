import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom"
import useUserContext from "../hooks/useUserContext"

export default function UserSearchPage({searchQuery}){

    const { token } = useUserContext();
    const [ UserAccounts , setUserAccounts ] = useState([])

    console.log(searchQuery);
    useEffect(()=>{
        async function fetchingData(){
            const response = await fetch(`http://localhost:3000/search/user/${searchQuery}`,{
                method:'GET',
                headers:{
                    'content-type': 'application/json',
                    'authorization' : `bearer ${token}`
                }
            })
            const json = await response.json();

            if(response.ok){
                setUserAccounts(json)
            }else{
                console.log(json);
            }
        }

        if(token && searchQuery) fetchingData();  
    },[token , searchQuery])

    return(
        <div className="user-searchPage-div">
            {UserAccounts.map(account=>(
                <Account key={account._id} userAccount={account} />
            ))}
        </div>
    )
}


function Account({userAccount}){

    const Navigate = useNavigate();
    function handleuserprofile(){
        Navigate(`/user/account/${userAccount.name}`, {state:{userId : userAccount._id}})
    }
    return (
        <div className="searchpage-div">
            
            <p className="searchpage-account-name" onClick={handleuserprofile}>
                {userAccount.name}
            </p>
            <p className="searchpage-account-followers">
                Followers : {userAccount.followers.length}
            </p>
            <p className="serachpage-account-following">
                Following : {userAccount.following.length}
            </p>
        </div>
    )
}