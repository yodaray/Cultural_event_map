import React from 'react';
import GLB from "../Setting.js";

const CommentGen = (props) => {
    let userAccount = props.UserAc;
    let userName = props.UserName;
    const regex = /GMT.*\)$/;

    function saveComment() {
        const API = GLB.backend + "/GetComment/" + props.LocationId;
        const content = document.querySelector("#NewComment").value;
        const commentObj = { author: userAccount, location: props.LocationId, content: content };

        fetch(API, {
            method: "PUT",
            headers: {
                "Content-type": 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: new URLSearchParams(commentObj)
        })
            .then(res => {
                if (res.ok) {
                    console.log("PUT Success");
                } else {
                    console.log("PUT Fail");
                }
                return res;
            })
            .catch(err => console.log(err));

        console.log("Done!");
        let time = new Date();
        time = time.toString();
        let str = "";
        str = `<h2><b>${userName}</b></h2><h5 style="color:black">${content}</h5><p style="color:grey; text-align: right">${time.replace(regex, "")}</p><hr/><br/>`;
        document.querySelector("#Comments").innerHTML += str;
        document.querySelector("#NewComment").value = "";
    }

    function loadComments() {
        const API = GLB.backend + "/GetComment/" + props.LocationId;

        fetch(API)
            .then(res => res.json())
            .then(text => {
                let str = "";
                for (let i = 0; i < text.length; i++) {
                    str += `<h2><b>${text[i].name}</b></h2><h5 style="color:black">${text[i].content}</h5><p style="color:grey; text-align: right">${text[i].date.replace(regex, "")}</p><hr/><br/>`;
                }
                document.querySelector("#Comments").innerHTML = str;
            })
            .catch(error => console.log(error));
    }

    // Load the comments every time the page is loaded
    loadComments();

    return (
        <div className="container">
            <div className="row">
                <section id="comment" className="col-12" style={{ display: "inline-block" }}>
                    <form>
                        <div className="mb-3">
                            <div id="Comments" className='commentText'></div>
                            <div>
                                <label htmlFor="new-comment" className="form-label">Please add your comment!</label>
                                <textarea className="form-control" id="NewComment" rows="3" required></textarea>
                            </div>
                        </div>
                        <button type="button" className="filterButton" onClick={saveComment}>Add comment</button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default React.memo(CommentGen);
