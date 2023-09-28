import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import useSave from "../hooks/useSave"

import ProfilePic from "../../images/profilePicture.png"
import useOptions from "../hooks/useOptions";


export default function ExternalUserArticle({ article, profilePicture, handleRemoveFromFeed }) {
    const OptionsRef = useRef();

    const dateArray = article.date?.split(' ');
    const date =()=>{
        if(dateArray) return dateArray[1] + " " + dateArray[2];
        return null
    } 

    const { save, handleSaveCLick, handleSaveLeave, handleSaveEnter } = useSave(article);
    const { dots, handleMouseEnter, handleMouseLeave, handleMouseUp } = useOptions(OptionsRef)

    const Navigate = useNavigate();

    function handleArticlePage() {
        Navigate(`/article/${article.title}`, { state: { articleId: article._id } })
    }
    return (
        <div className="landingPage-article">

            <div className="landingPage-article-accountDetails">

                {profilePicture ?
                    <img src={profilePicture} />
                    :
                    <img src={ProfilePic} />
                }

                <p className="landingPage-article-accountDetails-userName">
                    {article.userName}
                </p>


                <p className="landingPage-article-accouhtDetails-date">
                    · {date() && date()}
                </p>

            </div>

            <h1 className="landingPage-article-title" onClick={handleArticlePage}>
                {article.title}
            </h1>



            <p className="landingPage-article-data">
                {article.article.split('').splice(0, 200)}...
            </p>

            <div className="landingPage-article-details">


                {article?.tags[0] ? (
                    <div className="landingPage-article-tag">
                        {article?.tags[0]}
                    </div>

                ) : ""}

                <div className="landingPage-article-save-div" onClick={handleSaveCLick} onMouseEnter={handleSaveEnter} onMouseLeave={handleSaveLeave}>
                    <img src={save} />
                </div>

                <div className="landingPage-article-dots-div" >
                    <img src={dots} alt="settings" onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} />
                </div>

                <dialog ref={OptionsRef} className="landingPage-article-dialog">
                    <div className="landingPage-article-dialog-settingsAndEdit">
                        <p className="landingPage-article-dialog-muteAuthor">
                            Mute this author
                        </p>
                        <p className="landingPage-article-dialog-Report">
                            Report
                        </p>
                    </div>
                    <p className="landingPage-article-dialog-removeFromFeed" onClick={() => handleRemoveFromFeed(article._id)}>
                        Remove from feed
                    </p>

                </dialog>
            </div>
        </div>
    )
}