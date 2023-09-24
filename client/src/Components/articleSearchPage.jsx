import { useEffect , useState} from "react";
// import { useNavigate } from "react-router-dom"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";

export default function ArticleSearchPage({searchQuery}){

    const { token } = useUserContext();
    const [ articles , setArticles ] = useState([])

    console.log('hello')
    useEffect(()=>{
        async function fetchingData(){
            const response = await fetch(`http://localhost:3000/search/articles/${searchQuery}`,{
                method:'GET',
                headers:{
                    'content-type': 'application/json',
                    'authorization' : `bearer ${token}`
                }
            })
            const json = await response.json();

            if(response.ok){
                setArticles(json);
                console.log(json)
            }else{
                console.log(json);
            }
        }

        if(token && searchQuery) fetchingData();  
    },[token , searchQuery])

    return(
        <div className="article-searchPage-div">
            {articles.map(article=>(
                <Article key={article._id} article={article} />
            ))}
        </div>
    )
}


function Article({article}){
    
    const Navigate = useNavigate();

    function handleArticlepage(){
        Navigate(`/article/${article.title}` , {state : {articleId : article._id}})
    }
    function handleUserpage(){
        Navigate(`/user/account/${article.userName}`, {state:{userId : article.userId}})
    }

    return (
        <div className="articles-searchpage-article-div">
            <p className="searchpage-article-name" onClick={handleUserpage}>
                {article.userName}
            </p>
            <p className="searchpage-article-title" onClick={handleArticlepage}>
                {article.title}
            </p>
        </div>
    )
}