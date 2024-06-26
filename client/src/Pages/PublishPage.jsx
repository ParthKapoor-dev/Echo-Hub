import { useState, useRef } from "react"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";
import { CurrentMode } from "../../currentMode";


export default function PublishPage() {
    const [title, settitle] = useState('');
    const [article, setarticle] = useState('');
    const { token, user } = useUserContext();
    const [error, seterror] = useState(null);
    const [tags, setTags] = useState([]);
    const [disabled , setDisabled ] = useState(false);
    const tagsRef = useRef();
    const titleRef = useRef();
    const Navigate = useNavigate();
    console.log(user.profilePicture.url)
    async function handleSubmit(event) {
        event.preventDefault();
        setDisabled(true);
        if (title.length == 0 || article.length == 0) {
            seterror('All fields must be filled');
            return;
        }
        const url = CurrentMode.serverUrl + '/article/write';
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, article, userName: user.name, userProfilePicture: user.profilePicture, tags })
        });
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            Navigate('/profile');
        } else {
            seterror(json.message);
            settitle('');
            setarticle('');
            setTags([]);
            console.log(json)
        }
        setDisabled(false)
    }
    function handleTitleInput(event) {
        settitle(event.target.value)

        event.target.style.height = event.target.style.minHeight = 'auto';
        event.target.style.minHeight = `${event.target.scrollHeight}px`;
        event.target.style.height = `${event.target.scrollHeight}px`;

    }

    function handleArticleInput(event) {
        setarticle(event.target.value);

        event.target.style.height = event.target.style.minHeight = 'auto';
        event.target.style.minHeight = `${event.target.scrollHeight}px`;
        event.target.style.height = `${event.target.scrollHeight}px`;
    }
    function handleAddTags(event) {
        event.preventDefault();
        const newTag = tagsRef.current.value;
        setTags(prev => {
            const newTags = [...prev];
            newTags.push(newTag)
            return newTags
        });
        tagsRef.current.value = "";
    }

    function handleRemoveTag(removeThisTag) {
        setTags(prev => prev.filter(item => item !== removeThisTag))
    }
    return (
        <div className="publishPage-form" >
            <textarea id="publishPage-title" ref={titleRef} rows='1' onChange={handleTitleInput} value={title} placeholder="Title" />

            <textarea id="publishPage-article" cols="30" rows="10" value={article} onChange={handleArticleInput} placeholder="Write your article here" />

            <div className="publishPage-tags-div">
                <p className="publishPage-tags-description">
                    Add Tags related to your article
                </p>
                <input type="text" id="publishPage-tags-input" ref={tagsRef} />
                <button className="publishPage-tags-add-btn" onClick={handleAddTags} >
                    Add
                </button>
                <div className="publishPage-tags-list">
                    {tags.length ? (
                        tags.map(tag => (
                            <p key={tag}>
                                {tag}
                                <span className="publishPage-tags-p-remove" onClick={() => handleRemoveTag(tag)}>
                                    X
                                </span>
                            </p>
                        ))
                    ) : ("")}
                </div>
            </div>

            <button className="publishPage-submit" onClick={handleSubmit} disabled={disabled} >
                Publish
            </button>
            {error && <div className="error-div">{error}</div>}
        </div>
    )
}