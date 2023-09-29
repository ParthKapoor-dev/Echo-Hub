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
        <div className="UserArticle">

            <p className="UserArticle-accouhtDetails-date">
                {date() && date()}
            </p>

            <h1 className="UserArticle-title" onClick={handleArticlePage}>
                {article.title}
            </h1>
            <p className="UserArticle-data">
                {article.article.split('').splice(0, 200)}...
            </p>

            <div className="UserArticle-details">

                <div className="UserArticle-tags-div">
                    <p>
                        {article?.tags[0] ? (
                            article?.tags[0]
                        ) : ""}
                    </p>
                </div>

                <div className="UserArticle-save-div" onClick={handleSaveCLick} onMouseEnter={handleSaveEnter} onMouseLeave={handleSaveLeave}>
                    <img src={save} />
                </div>
                <div className="UserArticle-dots-div" >
                    <img src={dots} alt="settings" onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} />
                </div>
                <dialog ref={OptionsRef} className="UserArticle-dialog">
                    <div className="UserArticle-dialog-settingsAndEdit">
                        <p className="UserArticle-dialog-editStory">
                            Edit Story
                        </p>
                        <p className="UserArticle-dialog-StorySettings">
                            Story settings
                        </p>
                    </div>

                    <p className="UserArticle-dialog-deleteStory" onClick={(e) => deleteFunction(e, article._id)}>
                        Delete Story
                    </p>
                </dialog>

            </div>
        </div>
    )
}