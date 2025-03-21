import React from "react";
import './CRUD_Style.css';;

const UserProfileRead = () => {

    return (
        <>
            <section>
                <div className="text-center">
                    <h2 className="edit_title">Show Profile</h2>


                    <form action="" method="post">
                        <label htmlFor="userAc" >Account</label>
                        <input type="text" className="form-control text-center" id="userAc" name="userAc" placeholder={window.sessionStorage.getItem("UserAc")} readOnly />
                        <br />

                        <label htmlFor="name" >Nickname</label>
                        <input type="input" className="form-control text-center" id="name" name="name" placeholder={window.sessionStorage.getItem("UserName")} readOnly />
                        <br />


                    </form></div>
            </section>
        </>
    );
};

export default UserProfileRead;