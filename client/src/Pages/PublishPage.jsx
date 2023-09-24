import { useState } from "react"
import useUserContext from "../hooks/useUserContext"
import { useNavigate } from "react-router-dom";

export default function PublishPage(){
    const [title , settitle ] = useState('');
    const [article , setarticle] = useState('');
    const {token , user } = useUserContext();
    const [error , seterror] = useState(null)
    const Navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        if(title.length == 0 || article.length == 0 ){
            seterror('All fields must be filled');
            return;
        }
        const response = await fetch('http://localhost:3000/article/write',{
            method:"POST",
            headers:{
                'content-type':'application/json',
                'authorization' : `Bearer ${token}`
            },
            body: JSON.stringify({title , article , userName : user.name})
        })
        const json = await response.json();

        if(response.ok){
            console.log(json);
            Navigate('/profile')
        }else{
            seterror(json.message);
            settitle('');
            setarticle('');
            console.log(json)
        }
    }
    return (
        <form className="publishPage-form" onSubmit={handleSubmit}>
            <input type="text" id="publishPage-title" value={title} onChange={(e)=>settitle(e.target.value)} placeholder="Title"/>

            <textarea id="publishPage-article" cols="30" rows="10" value={article} onChange={(e)=>setarticle(e.target.value)} placeholder="Write your article here"/>

            <button className="publishPage-submit" >Submit Article</button>
            <p className="publishPage-submit-info">This will send your article to your followers ontheir email and also will be visible on your profile </p>
            {error && <div className="error-div">{error}</div>}
        </form>
    )
}