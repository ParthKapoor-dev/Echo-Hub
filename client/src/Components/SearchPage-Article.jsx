import { useEffect, useState } from "react";
import useUserContext from "../hooks/useUserContext"
import ExternalUserArticle from "./UserArticle-External";

export default function ArticleSearchPage({ searchQuery }) {

    const { token } = useUserContext();
    const [Articles, setArticles] = useState([]);
    const [PageIsLoading , setPageIsLoading] = useState(true)

    useEffect(() => {
        async function fetchingData() {
            const response = await fetch(`http://localhost:3000/search/articles/${searchQuery}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                }
            })
            const json = await response.json();

            if (response.ok) {
                console.log(json)
                setArticles(json);
                setPageIsLoading(false)
            } else {
                console.log(json);
            }
        }

        if (token && searchQuery) fetchingData();
    }, [token, searchQuery])

    return (
        <>
            {!PageIsLoading ? (
                        Articles.map(article=>(
                            <ExternalUserArticle key={article._id} article={article}  />
                        ))
            ) : (
                <div className="PageisLoading-div">
                    Wait Page is Currently loading
                </div>
            )}
        </>
    )
}


