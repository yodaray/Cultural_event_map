import React, { useEffect } from 'react';
import icon from '../icon.jpg';
import GLB from "../Setting.js";
import 'bootstrap/dist/css/bootstrap.css';
import './components.css';

async function LoginBackServer(UserCredentials) {
    let API = `${GLB.backend}/AuthenticateUser`;
    try {
        const response = await fetch(API, { method: "post", body: UserCredentials });
        const data = await response.json();
        return data;
    } catch (error) {
        window.alert(error);
    }
}

async function RegisterUser(datas) {
    let API = `${GLB.backend}/RegisterUser`;
    try {
        const response = await fetch(API, { method: "post", body: datas });
        const data = await response.json();
        return data;
    } catch (error) {
        window.alert(error);
    }
}

let isRegistered = null;

const LoginHandle = () => {

    const LoginProcess = async (e, UserAc, Password) => {
        e.preventDefault();
        let UserCredentials = new URLSearchParams();
        UserCredentials.append("UserAc", UserAc);
        UserCredentials.append("UserPw", Password);

        const checking = await LoginBackServer(UserCredentials);
        if (checking.Login_Status == true) {
            window.sessionStorage.setItem("Cookie", checking.UserName.toString());
            window.sessionStorage.setItem("UserName", checking.UserName);
            window.sessionStorage.setItem("Admin_Status", checking.Admin_Status);
            window.sessionStorage.setItem("UserAc", checking.UserAc);
            window.location.replace("/");
        }
        else {
            window.alert("Cannot Login: incorrect username/password.");
        }

    };

    //Register
    const register = async (event, uid, upw) => {
        event.preventDefault();
        if (upw.length < 4) {
            window.alert('Your Password needs to be more than 4 characters');
            window.location.reload();
        }
        let data = new URLSearchParams();
        data.append("uId", uid);
        data.append("uPw", upw);

        const regi = await RegisterUser(data);
        if (regi) {
            window.alert("Congrats, feel free to explore more about our cultural programmes");
            window.location.reload();
        }
        else {
            window.alert("The User Login Name exists");
        }
    };

    useEffect(() => {
        if (isRegistered == null) { isRegistered = window.confirm("Are you a registered user?"); }
        if (isRegistered) {
            // User is registered, show login button
            const loginButton = document.getElementById("loginButton");
            loginButton.style.display = "block";
        } else {
            // User is not registered, show register button
            window.alert("Please Fill in a Username and Password to register")
            const registerButton = document.getElementById("registerButton");
            registerButton.style.display = "block";
        }
    }, []);

    return (
        <div className="container">
            <div className="login-card">
                <h3>Explore more about our <span className='specailText'>cultural programmes</span></h3>
                <form className='card-body'>
                    <img className="imgage my-4" src={icon} alt="icon" /><br />
                    <label htmlFor="userId" className="d-none"></label>
                    <input type="text" id="userId" name="userId" className="userId form-control" placeholder="Username" required autoFocus />
                    <label htmlFor="password" className="d-none"></label>
                    <input type="password" id="password" name="password" className="password form-control" placeholder="Password" required />
                    <br></br>
                    <div className="button-container">
                        <button id="loginButton" className="btn btn-lg btn-block" type="button" onClick={(e) => LoginProcess(e, document.getElementById('userId').value, document.getElementById('password').value)} style={{ display: "none" }}>Login</button>
                        <button id="registerButton" className="btn btn-lg btn-block" type="button" onClick={(e) => register(e, document.getElementById('userId').value, document.getElementById('password').value)} style={{ display: "none" }}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default React.memo(LoginHandle);
