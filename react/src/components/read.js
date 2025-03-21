import React from 'react';
import { json, useParams } from 'react-router-dom';
import GLB from "../Setting.js";
import './CRUD_Style.css';

function Read(props) {
    let { Option } = useParams();

    //Reading Event
    if (Option == "Event") {
        const ReadEvent = (e) => {
            e.preventDefault();
            let foundEvent = false;
            const eventInput = document.querySelector('#eventId').value;
            for (let i = 0; i < props.EventDataSet.length; i++) {
                if (props.EventDataSet[i].eventId.toString() === eventInput.toString()) {
                    let API = GLB.backend + "/Read/Event/" + eventInput;
                    fetch(API)
                        .then(response => response.json())
                        .then(data => {
                            foundEvent = true;
                            document.querySelector('#title').value = props.EventDataSet[i].title;
                            document.querySelector('#venue').value = data.name;
                            document.querySelector('#date').value = props.EventDataSet[i].date;
                            document.querySelector('#description').value = props.EventDataSet[i].description;
                            document.querySelector('#presenter').value = props.EventDataSet[i].presenter;
                            document.querySelector('#price').value = props.EventDataSet[i].price;
                        })
                        .catch(error => foundEvent = false);
                    return;
                }
            }
            if (foundEvent === false) window.alert("Event not found");
        }

        return (
            <>
                <div className="text-center">
                    <h2>Read Event</h2>

                    <form action="" method="post">
                        <label htmlFor="eventId">Event Id</label>
                        <input type="text" className="form-control text-center" id="eventId" name="eventId" required />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={ReadEvent}>Read Event</button>
                        <br /> <br />

                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control text-center" id="title" name="title" readOnly />
                        <br />

                        <label htmlFor="venue">Venue</label>
                        <input type="text" className="form-control text-center" id="venue" name="venue" readOnly />
                        <br />

                        <label htmlFor="date">Date</label>
                        <input type="text" className="form-control text-center" id="date" name="date" readOnly />
                        <br />

                        <label htmlFor="description">Description</label>
                        <textarea className="form-control text-left" id="description" name="description" readOnly />
                        <br />

                        <label htmlFor="presenter">Presenter</label>
                        <input type="text" className="form-control text-center" id="presenter" name="presenter" readOnly />
                        <br />

                        <label htmlFor="price">Price</label>
                        <input type="text" className="form-control text-center" id="price" name="price" readOnly />
                        <br />
                    </form>
                </div>
            </>
        );
    }
    //Reading Location
    else if (Option == "Location") {

        const ReadLocation = (e) => {
            e.preventDefault();
            const LocationId = document.querySelector('#locationId').value;
            for (let i = 0; i < props.LocationDataSet.length; i++) {
                if (props.LocationDataSet[i].locationId.toString() === LocationId.toString()) {
                    document.querySelector('#name').value = props.LocationDataSet[i].name;
                    document.querySelector('#latitude').value = props.LocationDataSet[i].coordinates.lat;
                    document.querySelector('#longitude').value = props.LocationDataSet[i].coordinates.lng;
                    return;
                }
            }
            window.alert("Location not found");
        }

        return (
            <>
                <div className="text-center">
                    <h2>Read Location</h2>

                    <form action="" method="post">
                        <label htmlFor="locationId">Location ID</label>
                        <input type="text" className="form-control text-center" id="locationId" name="locationId" required />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={ReadLocation}>Read Location</button>
                        <br /> <br />

                        <label htmlFor="name">Location Name</label>
                        <input type="text" className="form-control text-center" id="name" name="name" readOnly />
                        <br />

                        <label htmlFor="latitude">Latitude</label>
                        <input type="text" className="form-control text-center" id="latitude" name="latitude" readOnly />
                        <br />

                        <label htmlFor="longitude">Longitude</label>
                        <input type="text" className="form-control text-center" id="longitude" name="longitude" readOnly />
                        <br />
                    </form>
                </div>
            </>
        );
    }
    //Reading User
    else if (Option == "User") {
        const ReadUser = (e) => {
            e.preventDefault();
            const userAc = document.querySelector('#userAc').value;
            let API = GLB.backend + "/Read/User/" + userAc;
            fetch(API)
                .then(response => response.json())
                .then(data => {
                    document.querySelector('#name').value = data.name;
                    document.querySelector('#password').value = data.password;
                })
                .catch(err => window.alert("User not found"));
        }

        return (
            <>
                <div className="text-center">
                    <h2>Read User</h2>

                    <form action="" method="post">
                        <label htmlFor="userAc">Account</label>
                        <input type="text" className="form-control text-center" id="userAc" name="userAc" />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={ReadUser}>Read User</button>
                        <br /> <br />

                        <label htmlFor="name">Nickname</label>
                        <input type="input" className="form-control text-center" id="name" name="name" readOnly />
                        <br />

                        <label htmlFor="password">User Password</label>
                        <input type="input" className="form-control text-center" id="password" name="password" readOnly />
                        <br />
                    </form>
                </div>
            </>
        );
    }
}



export default React.memo(Read);
