import { useEffect, useState } from "react"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";
export default function LandingPage(){

    const [Articles, setArticles] = useState([]);
    const [PageIsLoading , setPageIsLoading ] = useState(true)
    const { user , token } = useUserContext();
    const [ error , setError ] = useState(null)
    useEffect(()=>{
        async function fetchingData(){
            const response = await fetch(`http://localhost:3000/article/feed/${user._id}`,{
                method:"GET",
                headers:{
                    'content-type' : 'application/json',
                    'authorization' : `Bearer ${token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                setArticles(json);
                setPageIsLoading(false)
            } else{
                console.log(json);
                setError(json.message)
            }
        }

        if(token && user ) fetchingData();
    },[user , token])

    return(
        <>
        {!PageIsLoading ? (
            <div className="landingpage-div">
            {Articles.map(article=>(
                <Article key={article[0]._id} article={article[0]} />
            ))}
        </div>
        ):(
            <div className="PageisLoading-div">
                Wait Page is Currently loading 
                {error ?? (
                    <div className="error-div">{error}</div>
                )}
            </div>
        ) }
        </>
        
    )
}

function Article({article}){
    const articleData = article.article.slice(0,100);
    const Navigate = useNavigate();
    function handleArticle(){
        Navigate(`/article/${article._id}` , {state : {articleId : article._id}})
    }
    function handleAuthor(){
        Navigate(`/user/account/${article.userName}` , {state : {userId : article.userId}})
    }
    return(
        <div className="landingpage-article-div">
            <p className="landingpage-article-title" onClick={handleArticle}>
                {article.title}
            </p>
            <p className="landingpage-article-text">
                {articleData}
            </p>
            <p className="landingpage-article-author" onClick={handleAuthor}>
                Author : {article.userName}
            </p>
        </div>
    )
}