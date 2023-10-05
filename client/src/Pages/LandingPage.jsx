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
                console.log(json)
                setArticles(json);
                setPageIsLoading(false)
            } else {
                console.log(json);
                setError(json.message)
            }
        }

        if (token && user) fetchingData();
    }, [user, token])

    function handleRemoveFromFeed(articleId) {
        const newArticles = Articles.map(articleData => (
            articleData.filter(article => {
                if (!article?._id || article?._id !== articleId) {
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
                        {Articles.length && Articles.map(article => (
                            <ExternalUserArticle key={article._id} article={article} />
                        ))}
                    </div>

                    <BioSection />

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

function BioSection() {
    const { token } = useUserContext();
    const [likedTags, setlikedTags] = useState([]);
    const [likedTagsAccounts, setlikedtagsaccounts] = useState([]);
    useEffect(() => {
        async function fetchingData() {
            console.log('begin')
            const response = await fetch('http://localhost:3000/accounts/landingPage/Bio', {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            const json = await response.json();

            if (response.ok) {
                setlikedTags(json.likedTags);
                setlikedtagsaccounts(json.finalAccounts);
                console.log(json)
            } else {
                console.log(json)
            }
        }

        if (token) fetchingData();
    }, [token])
    return (
        <div className="landingPage-Bio-Section">

            <div className="landingPage-StaffPicks">
                <p className="landingPage-StaffPicks-headings">
                    Staff Picks
                </p>
            </div>

            <div className="landingPage-Recommended-tags">
                <p className="landingPage-Recommended-tags-headings">
                    Recommended Tags
                </p>

                <div className="landingPage-Recommended-tags-div">
                    {likedTags.map(tag => (
                        <div key={tag} className="landingPage-recommended-tag">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>

            <div className="landingPage-whoToFollow">
                <p className="landingPage-whoToFollow-heading">
                    Who To follow
                </p>

                <div className="landingPage-whoToFollow-div">
                    {likedTagsAccounts.map(account => (
                        <div key={account._id} className="landingPage-whoToFollow-account">
                            {account.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}