import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import useSave from "../hooks/useSave"
import useOptions from "../hooks/useOptions";

export default function UserArticle({ article, deleteFunction }) {
    const OptionsRef = useRef();
    const Navigate = useNavigate();

    const dateArray = article.date?.split(' ');
    const date = () => {
        if (dateArray) return dateArray[1] + " " + dateArray[2];
        return null
    }

    const { save, handleSaveCLick, handleSaveLeave, handleSaveEnter } = useSave(article);
    const { dots, handleMouseEnter, handleMouseLeave, handleMouseUp } = useOptions(OptionsRef)


    function handleArticlePage() {
        Navigate(`/article/${article.title}`, { state: { articleId: article._id } })
    }

    return (
        <div className="userPage-article">

            <p className="userPage-article-accouhtDetails-date">
                {date() && date()}
            </p>

            <h1 className="userPage-article-title" onClick={handleArticlePage}>
                {article.title}
            </h1>
            <p className="userPage-article-data">
                {article.article.split('').splice(0, 200)}...
            </p>

            <div className="userPage-article-details">

                {article?.tags[0] ? (
                    <div className="landingPage-article-tag">
                        {article?.tags[0]}
                    </div>

                ) : ""}
                
                <div className="userPage-article-save-div" onClick={handleSaveCLick} onMouseEnter={handleSaveEnter} onMouseLeave={handleSaveLeave}>
                    <img src={save} />
                </div>
                <div className="userPage-article-dots-div" >
                    <img src={dots} alt="settings" onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} />
                </div>
                <dialog ref={OptionsRef} className="userPage-article-dialog">
                    <div className="userPage-article-dialog-settingsAndEdit">
                        <p className="userPage-article-dialog-editStory">
                            Edit Story
                        </p>
                        <p className="userPage-article-dialog-StorySettings">
                            Story settings
                        </p>
                    </div>

                    <p className="userPage-article-dialog-deleteStory" onClick={(e) => deleteFunction(e, article._id)}>
                        Delete Story
                    </p>
                </dialog>

            </div>
        </div>
    )
}