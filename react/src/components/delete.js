
import React from 'react';
import { useParams } from 'react-router-dom';
import GLB from "../Setting.js";
import './CRUD_Style.css';


function Delete(props) {
    let { Option } = useParams();

    //Deleting Event
    if (Option == "Event") {
        const DeleteEvent = (e) => {
            e.preventDefault();
            const eventId = document.querySelector('#eventId').value;

            let data = new URLSearchParams();
            let API = GLB.backend + "/Delete/Event";
            data.append("eventId", eventId);

            fetch(API, { method: "post", body: data })
                .then(response => response.text())
                .then(data => {
                    if (data.indexOf("Deleted") !== -1) {
                        props.setEnd(null);
                        window.alert(data);
                    } else {
                        window.alert(data);
                    }
                })
                .catch(error => window.alert("Event not found"));
        };

        return (
            <>
                <div className="text-center">
                    <h2>Delete Event</h2>
                    <form>
                        <label htmlFor="eventId">Enter the event ID you wish to delete</label>
                        <input type="text" className="form-control" placeholder="Event ID" id="eventId" name="eventId" />
                        <br />
                        <button className="btn btn-lg btn-block" onClick={DeleteEvent}>Delete</button>
                    </form>
                </div>
            </>
        );
    }

    if (Option == "Location") {
        const DeleteLocation = (e) => {
            e.preventDefault();

            const locationId = document.querySelector('#locationId').value;
            let data = new URLSearchParams();
            let API = GLB.backend + "/Delete/Location";
            data.append("locationId", locationId);

            fetch(API, { method: "post", body: data })
                .then(response => response.text())
                .then(data => {
                    if (data.indexOf("Deleted") !== -1) {
                        props.setEnd(null);
                        window.alert(data);
                    } else {
                        window.alert(data);
                    }
                })
                .catch(error => window.alert("Location not found"));
        };

        return (
            <>
                <div className="text-center">
                    <h2>Delete Location</h2>

                    <form>
                        <label htmlFor="locationId" className="d-none">Location ID</label>
                        <input type="text" className="form-control" placeholder="Location ID" id="locationId" name="locationId" />
                        <br />
                        <button className="btn btn-lg btn-block" onClick={DeleteLocation}>Delete</button>
                    </form>
                </div>
            </>
        );
    }

    if (Option == "User") {
        const DeleteUser = (e) => {
            e.preventDefault();

            const userAc = document.querySelector('#userAc').value;
            let data = new URLSearchParams();
            let API = GLB.backend + "/Delete/User";
            data.append("userAc", userAc);
            console.log(data);

            fetch(API, { method: "post", body: data })
                .then(response => response.text())
                .then(data => {
                    if (data.indexOf("Deleted") !== -1) {
                        props.setEnd(null);
                        window.alert(data);
                    } else {
                        window.alert(data);
                    }
                })
                .catch(error => window.alert("User not found"));
        };

        return (
            <>
                <div className="text-center">
                    <h2>Delete User</h2>

                    <form>
                        <label htmlFor="userAc" className="d-none">Account</label>
                        <input type="text" className="form-control" placeholder="Account" id="userAc" name="userAc" />
                        <br />
                        <button className="btn btn-lg btn-block" onClick={DeleteUser}>Delete</button>
                    </form>
                </div>
            </>
        );
    }

}

export default React.memo(Delete);
