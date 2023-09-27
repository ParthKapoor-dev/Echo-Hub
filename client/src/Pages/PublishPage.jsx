import {  useState , useRef } from "react"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";

export default function PublishPage() {
    const [title, settitle] = useState('');
    const [article, setarticle] = useState('');
    const { token, user } = useUserContext();
    const [error, seterror] = useState(null);
    const [tags , setTags ] = useState([]);
    const tagsRef = useRef();
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
            body: JSON.stringify({ title, article, userName: user.name , tags })
        })
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            Navigate('/profile')
        } else {
            seterror(json.message);
            settitle('');
            setarticle('');
            setTags([]);
            console.log(json)
        }
    }
    function handleTitleInput(event) {
        settitle(event.target.value);
    }
    function handleAddTags(event){
        event.preventDefault();
        const newTag = tagsRef.current.value;
        setTags(prev=>{
            const newTags = [...prev];
            newTags.push(newTag)
            return newTags
        });
        tagsRef.current.value = "";
    }
    return (
        <div className="publishPage-form" >
            <textarea id="publishPage-title" rows='1' onChange={handleTitleInput} value={title} placeholder="Title" />

            <textarea id="publishPage-article" cols="30" rows="10" value={article} onChange={(e) => setarticle(e.target.value)} placeholder="Write your article here" />

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
                        tags.map(tag=>tag)
                    ):("")}
                </div>
            </div>

            <button className="publishPage-submit" onClick={handleSubmit} >
                Publish
            </button>
            {error && <div className="error-div">{error}</div>}
        </div>
    )
}