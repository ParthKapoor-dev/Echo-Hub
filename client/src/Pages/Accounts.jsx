import { useEffect , useState } from "react"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";
export default function Accounts(){
    const { token } = useUserContext();
    const [accounts , setaccounts ] = useState([]);
    useEffect(()=>{
        async function fetchingData(){
            const response = await fetch('http://localhost:3000/accounts/all',{
                method:"GET",
                headers:{
                    'content-type' : 'application/json',
                    'authorization': `bearer ${token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                setaccounts(json)
            }else{
                console.log(json)
            }


        }
        if(token) fetchingData()
    },[token]);

    
    
    return(
        <div className="accountsPage-div">
            {accounts.map(account=>(
                <Account key={account._id} account={account}/>
            ))}
        </div>
    )
}

function Account({account }){

    const Navigate = useNavigate();

    function handleAccountProfile(){
        Navigate(`/user/account/${account.name}`, {state:{userId : account._id}})
    }

    return(
        <div className="accountsPage-account-div" key={account._id}>
            <p className="userName" onClick={handleAccountProfile}>
                {account.name}
            </p>
            <p className="accountsPage-account-followers">
                Followers:{account.followers.length} 
            </p>
            <p className="accountsPage-account-following">
                Following:{account.following.length} 
            </p>
            
        </div>
    )
}