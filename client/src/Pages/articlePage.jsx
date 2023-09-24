import { useEffect , useState } from "react";
import { useLocation } from "react-router-dom"
import useUserContext from "../hooks/useUserContext";
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
                setarticleData(json)
            }else{
                console.log(json)
            }
        }

        if(token && articleId) fetchingData();
    },[articleId , token])
    return(
        <div className="articlepage-div">
            <div className="articlepage-title-div">
                {articleData.title}
            </div>
            <div className="articlepage-article-div">
                {articleData.article}
            </div>
        </div>
    )
}