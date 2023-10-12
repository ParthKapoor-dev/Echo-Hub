import { useEffect, useState } from "react";
import useUserContext from "../hooks/useUserContext"
import ExternalUserArticle from "./UserArticle-External";
import { useLocation } from "react-router-dom";

import LoadingPageGif from "../../images/Loading Page animation1.gif"

export default function ArticleSearchPage({ setTags }) {
    const location = useLocation();
    const searchQuery = location.state;
    const { token } = useUserContext();
    const [Articles, setArticles] = useState([]);
    const [PageIsLoading, setPageIsLoading] = useState(true)
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
                console.log(searchQuery)
                console.log(json)
                setArticles(json.relatedArticles);
                setTags(json.relatedTags)
                setPageIsLoading(false)
            } else {
                console.log(json);
            }
        }

        if (token && searchQuery) fetchingData();
    }, [token, searchQuery, setTags])

    return (
        <>
            {!PageIsLoading ? (
                Articles.map(article => (
                    <ExternalUserArticle key={article._id} article={article} />
                ))
            ) : (
                <div className="PageisLoading-div">
                    <img src={LoadingPageGif} />
                    {/* {error ?? (
                        <div className="error-div">{error}</div>
                    )} */}
                </div>
            )}
        </>
    )
}


