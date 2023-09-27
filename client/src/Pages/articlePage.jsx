import { useEffect , useState } from "react";
import { useLocation } from "react-router-dom"
import useUserContext from "../hooks/useUserContext";

import ProfilePic from "../../images/profilePicture.png"

export default function ArticlePage(){
    const location = useLocation();
    const articleId = location.state.articleId;
    const { token } = useUserContext();
    const [articleData , setarticleData] = useState([]);
    useEffect(()=>{
        async function fetchingData(){ 
            const response = await fetch(`http://localhost:3000/article/${articleId}` , {
                method:'GET',
                headers:{
                    'content-type' : 'application/json',
                    'authorization' : `bearer ${token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                console.log(json)
                const newArticle = json.article.replace(/\n/g, "<br>");
                json.article = newArticle;
                setarticleData(json)
            }else{
                console.log(json)
            }
        }

        if(token && articleId) fetchingData();
    },[articleId , token])
    return(
        <div className="articlePage-div">
            <h1 className="articlePage-title">
                {articleData.title}
            </h1>

            <div className="articlePage-user-details">
                {articleData.profilePicture ? (
                    <img src={articleData.profilePicture} />
                ):(
                    <img src={ProfilePic}/>
                )}

                <p className="articlePage-userName">
                    {articleData.userName}
                </p>
            </div>

            <div className="articlePage-actions-div">
                {/* save
                    Likes
                    Comments
                    Share
                    Options
                */}
            </div>

            <div className="articlePage-article-div" dangerouslySetInnerHTML={{ __html: articleData.article }} />

        </div>
    )
}