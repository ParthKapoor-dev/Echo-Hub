import { useEffect, useState } from "react"
import useUserContext from "../hooks/useUserContext"
import ExternalUserArticle from "../Components/UserArticle-External";


export default function LandingPage() {

    const [Articles, setArticles] = useState([]);
    const [PageIsLoading, setPageIsLoading] = useState(true)
    const { user, token } = useUserContext();
    const [error, setError] = useState(null)
    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/article/feed/${user._id}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setArticles(json);
                setPageIsLoading(false)
            } else {
                console.log(json);
                setError(json.message)
            }
        }

        if (token && user) fetchingData();
    }, [user, token])

    function handleRemoveFromFeed(articleId){
        const newArticles = Articles.map(articleData=>(
            articleData.filter(article=>{
                if( !article?._id || article?._id !== articleId) {
                    return 1;
                }
                return 0;
            })
        ))
        setArticles(newArticles)
    }

    return (
        <>
            {!PageIsLoading ? (
                <div className="landingPage-div">
                    <div className="landingPage-content-section">
                        {Articles.map((articleData)=>{
                            const profilePicture = articleData[articleData.length -1];
                            return(
                                articleData.map((article,index)=>{
                                    if(index == articleData.length - 1) return
                                    return (
                                        <ExternalUserArticle key={article._id} article={article} profilePicture={profilePicture} handleRemoveFromFeed={handleRemoveFromFeed} />
                                    )
                                })
                            )
                        })}
                    </div>

                </div>
            ) : (
                <div className="PageisLoading-div">
                    Wait Page is Currently loading
                    {error ?? (
                        <div className="error-div">{error}</div>
                    )}
                </div>
            )}
        </>

    )
}