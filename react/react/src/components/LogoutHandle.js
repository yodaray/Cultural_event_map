import React, { useState, useEffect } from 'react';
import "./style3.css";

const LogOut = (props) => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const user = window.sessionStorage.getItem("userName");
            setUserName(user);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const confirmLogOut = () => {
        if (window.confirm("Are you sure to log out?")) {
            window.sessionStorage.removeItem("fakeCookie");
            window.sessionStorage.removeItem("userName");
            window.sessionStorage.removeItem("isAdmin");
            window.sessionStorage.removeItem("userAc");
            window.sessionStorage.removeItem("evTrigger");
            window.sessionStorage.removeItem("firstLoad");
            window.sessionStorage.removeItem("lastUpdate");
            window.location.replace("/");
        }
    }

    return (
        <div>
            <div id="topright">
                <i>{userName}</i>
                <button type="button" id="idid" style={{ backgroundColor: 'rosybrown', color: 'white' }} className="btn" onClick={confirmLogOut}> logout</button>
            </div>
        </div>
    );
}

export default React.memo(LogOut);

