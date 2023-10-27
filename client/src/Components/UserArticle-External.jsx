import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import useSave from "../hooks/useSave"

import ProfilePic from "/images/profilePicture.png"
import useOptions from "../hooks/useOptions";


export default function ExternalUserArticle({ article, handleRemoveFromFeed }) {
    const OptionsRef = useRef();
    const dateArray = article.date?.split(' ');
    const date = () => {
        if (dateArray) return dateArray[1] + " " + dateArray[2];
        return null
    }
    const { save, handleSaveCLick, handleSaveLeave, handleSaveEnter } = useSave(article);
    const { dots, handleMouseEnter, handleMouseLeave, handleMouseUp } = useOptions(OptionsRef)

    const Navigate = useNavigate();

    function handleArticlePage() {
        Navigate(`/article/${article.title}`, { state: { articleId: article._id } })
    }
    return (
        <div className="ExternalUserArticle">

            <div className="ExternalUserArticle-accountDetails">

                {article?.userProfilePicture?.url !== "" ?
                    <img src={article.userProfilePicture.url} />
                    :
                    <img src={ProfilePic} />
                }

                <p className="ExternalUserArticle-accountDetails-userName">
                    {article.userName}
                </p>

                <p className="ExternalUserArticle-accouhtDetails-date">
                    · {date() && date()}
                </p>

            </div>

            <h1 className="ExternalUserArticle-title" onClick={handleArticlePage}>
                {article.title}
            </h1>

            <p className="ExternalUserArticle-data">
                {article.article.split('').splice(0, 200)}...
            </p>

            <div className="ExternalUserArticle-details">

                <div className="ExternalUserArticle-tags-div">
                    <p>
                        {article?.tags[0] ? (
                            article?.tags[0]
                        ) : ""}
                    </p>
                </div>


                <div className="ExternalUserArticle-save-div" onClick={handleSaveCLick} onMouseEnter={handleSaveEnter} onMouseLeave={handleSaveLeave}>
                    <img src={save} />
                </div>

                <div className="ExternalUserArticle-dots-div" >
                    <img src={dots} alt="settings" onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} />
                </div>

                <dialog ref={OptionsRef} className="ExternalUserArticle-dialog">
                    <div className="ExternalUserArticle-dialog-settingsAndEdit">
                        <p className="ExternalUserArticle-dialog-muteAuthor">
                            Mute this author
                        </p>
                        <p className="ExternalUserArticle-dialog-Report">
                            Report
                        </p>
                    </div>
                    <p className="ExternalUserArticle-dialog-removeFromFeed" onClick={() => handleRemoveFromFeed(article._id)}>
                        Remove from feed
                    </p>

                </dialog>
            </div>
        </div>
    )
}