import { useState } from "react"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";

export default function PublishPage() {
    const [title, settitle] = useState('');
    const [article, setarticle] = useState('');
    const { token, user } = useUserContext();
    const [error, seterror] = useState(null)
    const Navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        if (title.length == 0 || article.length == 0) {
            seterror('All fields must be filled');
            return;
        }
        const response = await fetch('http://localhost:3000/article/write', {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, article, userName: user.name })
        })
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            Navigate('/profile')
        } else {
            seterror(json.message);
            settitle('');
            setarticle('');
            console.log(json)
        }
    }

    function handleTitleInput(event) {
        settitle(event.target.value);
    }
    return (
        <div className="publishPage-form" >
            <textarea id="publishPage-title" rows='1' onChange={handleTitleInput} value={title} placeholder="Title" />

            <textarea id="publishPage-article" cols="30" rows="10" value={article} onChange={(e) => setarticle(e.target.value)} placeholder="Write your article here" />

            <button className="publishPage-submit" onClick={handleSubmit} >
                Publish
            </button>
            {error && <div className="error-div">{error}</div>}
        </div>
    )
}

// Add Bio In Search Page and Feed Page
// Input Image Problem solving
// Add Images in the articles
// Add Profile Background Image addition
// Add Date of publish in the article
// Add Tags
// Add Tags to the Feed