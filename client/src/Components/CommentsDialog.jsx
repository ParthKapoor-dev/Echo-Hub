import { useRef , useState } from "react"
import useUserContext from "../hooks/useUserContext";
import threeDots from "/images/three dots static filled.png"
import cancelPng from "/images/cancel.png"
import ProfilePic from "/images/profilePicture.png"

export default function CommentsDialog({ articleData, commentDialogRef, setarticleData }) {
    const commentRef = useRef();
    const { token, user } = useUserContext();
    const [respondDisabled, setRespondDisabled] = useState(true);
    console.log(user.profilePicture)
    async function handleRespond() {
        const response = await fetch(`https://echo-hub-server.onrender.com/article/comment/`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                articleId: articleData._id,
                commentUserName: user.name,
                commentProfilePicture: user.profilePicture,
                comment: commentRef.current.value
            })
        });
        const json = await response.json();

        if (response.ok) {
            console.log(json)
            setarticleData((prev) => {
                const article = { ...prev, comments: json.comments };
                return article;
            })
            commentRef.current.value = ""
        } else {
            console.log(json)
        }
    }
    function handleResponseClose() {
        commentRef.current.value = "";
        commentDialogRef.current.style.transform  = "translateX(100%)"
        setTimeout(()=>commentDialogRef.current.close() , 250 );
    }

    function handleTextAreaOnchange() {
        if (commentRef.current.value == "") setRespondDisabled(true);
        else setRespondDisabled(false)
    }

    // async function handleCommentLike(){

    // }


    return (
        <dialog className="Comments-dialog" ref={commentDialogRef}>

            <p className="comments-dialog-heading">
                Responses ({articleData.comments && articleData.comments.length})
            </p>
            <div className="comments-dialog-inputBox">
                <div className="comments-dialog-inputBox-userDetails">
                    {user && (user.profilePicture.url !== "" ? (
                        <img src={user.profilePicture.url} />
                    ) : (
                        <img src={ProfilePic} />
                    ))}
                    <p>
                        {user && user.name}
                    </p>
                </div>

                <textarea ref={commentRef} placeholder="What are your thoughts?" id="" cols="10" rows="10" onChange={handleTextAreaOnchange} />
                <br />
                <div className="comments-dialog-inputBox-buttons">
                    <button className="inputBox-cancel-btn" onClick={handleResponseClose}>Cancel</button>
                    <button className="inputBox-respond-btn" onClick={handleRespond} disabled={respondDisabled}>Respond</button>
                </div>

            </div>

            <div className="other-comments">
                {articleData.comments && articleData.comments.map((comment, index) => (
                    <CommentBox comment={comment} setarticleData={setarticleData} key={index} />
                ))}
            </div>
        </dialog>
    )
}


function CommentBox({ comment, setarticleData }) {

    const OptionsRef = useRef();
    const { user } = useUserContext();
    function handleOptions() {
        OptionsRef.current.show();
        OptionsRef.current.style.opacity = 1;
        OptionsRef.current.style.transform = "translateY(0)";    }

    return (
        <div className="other-comment">
            <div className="other-comments-user-details">

                {comment.commentProfilePicture.url !== "" ? (
                    <img src={comment.commentProfilePicture.url} />
                ) : (
                    <img src={ProfilePic} />
                )}

                <div className="other-comments-name-and-date">
                    <p className="other-comments-name">
                        {comment.commentUserName}
                    </p>
                    <p className="other-comments-date">
                        {comment.date.split(' ')[1]} {comment.date.split(' ')[2]}
                    </p>
                </div>

                <div className="other-comments-options"
                    onClick={handleOptions} >
                    <img src={threeDots} />
                </div>

                {comment.userId === user._id ? (
                    <DeleteDialog OptionsRef={OptionsRef}
                        comment={comment} setarticleData={setarticleData} />
                ) : (
                    <ReportDialog OptionsRef={OptionsRef} comment={comment} />
                )}
            </div>
            <div className="other-comments-theComment">
                {comment.comment}
            </div>
        </div>
    )
}


function DeleteDialog({ OptionsRef, comment, setarticleData }) {

    const { token } = useUserContext();

    async function handleDeleteComment() {
        console.log(comment.commentId);
        console.log('the end of the line for this commentID')
        const response = await fetch('https://echo-hub-server.onrender.com/article/comment/delete', {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                articleId: comment.articleId,
                commentId: comment.commentId
            })
        });
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            setarticleData(json)
            handleClose();
        } else {
            console.error(json);
        }
    }

    function handleClose() {
        OptionsRef.current.style.transform = "translateY(-20%)";
        OptionsRef.current.style.opacity = 0;
        setTimeout(() => OptionsRef.current.close(), 250);    
    }

    return (
        <dialog className="commentBox-delete-dialog" ref={OptionsRef}>
            <div className="commentBox-close" onClick={handleClose}>
                <img src={cancelPng} />
            </div>
            <div className="commentBox-delete" onClick={handleDeleteComment}>
                Delete
            </div>
        </dialog>
    )
}

function ReportDialog({ OptionsRef }) {

    function handleClose() {
        OptionsRef.current.style.transform = "translateY(-20%)";
        OptionsRef.current.style.opacity = 0;
        setTimeout(() => OptionsRef.current.close(), 250);   
    } 

    return (
        <dialog className="commentBox-report-dialog" ref={OptionsRef}>
            <div className="commentBox-close" onClick={handleClose}>
                <img src={cancelPng} />
            </div>
            <div className="commentBox-report">
                Report
            </div>
        </dialog>
    )
}