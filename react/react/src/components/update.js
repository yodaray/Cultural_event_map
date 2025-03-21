import React from 'react';
import { useParams } from 'react-router-dom';
import GLB from "../Setting.js";
import './CRUD_Style.css';

function Update(props) {
    let { Option } = useParams();
    //Update Event
    if (Option == "Event") {
        const ReadEvent = (e) => {
            e.preventDefault();
            const EventId = document.querySelector('#eventId').value;
            let foundEvent = false;
            for (let i = 0; i < props.EventDataSet.length; i++) {
                if (props.EventDataSet[i].eventId.toString() === EventId.toString()) {
                    let API = GLB.backend + "/Read/Event/" + EventId;
                    fetch(API)
                        .then(response => response.json())
                        .then(data => {
                            foundEvent = true;
                            document.querySelector('#title').value = props.EventDataSet[i].title;
                            document.querySelector('#locationId').value = data.locationId;
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

        const UpdateEvent = (e) => {
            e.preventDefault();

            const EventId = document.querySelector('#eventId').value;
            const EventTitle = document.querySelector('#title').value;
            const EventVenue = document.querySelector('#locationId').value;
            const EventDate = document.querySelector('#date').value;
            const Description = document.querySelector('#description').value;
            const Presenter = document.querySelector('#presenter').value;
            const Price = document.querySelector('#price').value;

            let data = new URLSearchParams();
            let API = GLB.backend + "/Update/Event";
            data.append("eventId", EventId);
            data.append("title", EventTitle);
            data.append("locationId", EventVenue);
            data.append("date", EventDate);
            data.append("description", Description);
            data.append("presenter", Presenter);
            data.append("price", Price);

            fetch(API, { method: "post", body: data })
                .then(response => response.text())
                .then(data => {
                    if (data.indexOf("Updated") != -1) {
                        window.alert(data);
                        props.setEnd(null);
                    }
                    else window.alert(data);
                })
                .catch(error => console.log(error));
        }

        return (
            <>
                <div className="text-center">
                    <h2 className='temp_test'>Update Event</h2>

                    <form>
                        <label htmlFor="eventId">Event Id</label>
                        <input type="text" className="form-control text-center" id="eventId" name="eventId" required />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={ReadEvent}>Load Event</button>
                        <br /> <br />

                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control text-center" id="title" name="title" />
                        <br />

                        <label htmlFor="locationId">Location ID</label>
                        <input type="text" className="form-control text-center" id="locationId" name="venue" />
                        <br />

                        <label htmlFor="date">Date</label>
                        <input type="text" className="form-control text-center" id="date" name="date" />
                        <br />

                        <label htmlFor="description">Description</label>
                        <textarea className="form-control" id="description" name="description" />
                        <br />

                        <label htmlFor="presenter">Presenter</label>
                        <input type="text" className="form-control text-center" id="presenter" name="presenter" />
                        <br />

                        <label htmlFor="price">Price</label>
                        <input type="text" className="form-control text-center" id="price" name="price" />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={UpdateEvent}>Update</button>
                    </form>
                </div>
            </>
        );
    }
    //Update Location
    else if (Option == "Location") {
        const ReadLocation = (e) => {
            e.preventDefault();
            let LocationId = document.querySelector('#locationId').value;

            for (let i = 0; i < props.LocationDataSet.length; i++) {
                if (props.LocationDataSet[i].locationId.toString() == LocationId.toString()) {
                    document.querySelector('#name').value = props.LocationDataSet[i].name;
                    document.querySelector('#latitude').value = props.LocationDataSet[i].coordinates.lat;
                    document.querySelector('#longitude').value = props.LocationDataSet[i].coordinates.lng;
                    return;
                }
            }
            window.alert("Location not found")

        }

        const UpdateLocation = (e) => {
            e.preventDefault();

            const LocationId = document.querySelector('#locationId').value;
            const LocationName = document.querySelector('#name').value;
            const LocationLat = document.querySelector('#latitude').value;
            const LocationLng = document.querySelector('#longitude').value;

            let data = new URLSearchParams();
            let API = GLB.backend + "/Update/Location";
            data.append("locationId", LocationId);
            data.append("name", LocationName);
            data.append("latitude", LocationLat);
            data.append("longitude", LocationLng);

            fetch(API, { method: "post", body: data })
                .then(response => response.text())
                .then(data => {
                    if (data.indexOf("Updated") != -1) {
                        window.alert(data);
                        props.setEnd(null);
                    }
                    else window.alert(data);
                })
                .catch(error => console.log(error));
        }

        return (
            <>
                <div className="text-center">
                    <h2>Update Location</h2>

                    <form>
                        <label htmlFor="locationId">Location ID</label>
                        <input type="text" className="form-control text-center" id="locationId" name="locationId" required />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={ReadLocation}>Load Location</button>
                        <br /> <br />

                        <label htmlFor="name">Location Name</label>
                        <input type="text" className="form-control text-center" id="name" name="name" />
                        <br />

                        <label htmlFor="latitude">Latitude</label>
                        <input type="text" className="form-control text-center" id="latitude" name="latitude" />
                        <br />

                        <label htmlFor="longitude">Longitude</label>
                        <input type="text" className="form-control text-center" id="longitude" name="longitude" />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={UpdateLocation}>Update</button>
                    </form>
                </div>
            </>
        );
    }
    //Update User
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

        const UpdateUser = (e) => {
            e.preventDefault();

            const UserAc = document.querySelector('#userAc').value;
            const UserNewAc = document.querySelector('#userNewAc').value
            const Name = document.querySelector('#name').value;
            const Password = document.querySelector('#password').value;

            let data = new URLSearchParams();
            let API = GLB.backend + "/Update/User";
            data.append("userAc", UserAc);
            data.append("userNewAc", UserNewAc);
            data.append("name", Name);
            data.append("password", Password);


            fetch(API, { method: "post", body: data })
                .then(response => response.text())
                .then(data => window.alert(data))
                .catch(error => console.log(error));
        }

        return (
            <>
                <div className="text-center">
                    <h2>Update User</h2>

                    <form>
                        <label htmlFor="userAc">Account</label>
                        <input type="text" className="form-control text-center" id="userAc" name="userAc" />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={ReadUser}>Load User</button>
                        <br /> <br />

                        <label htmlFor="userNewAc">Update User ac to</label>
                        <input type="text" className="form-control text-center" placeholder='You must input this cell while updating' id="userNewAc" name="userNewAc" />
                        <br />

                        <label htmlFor="name">Update User nickname to</label>
                        <input type="input" className="form-control text-center" id="name" name="name" />
                        <br />

                        <label htmlFor="password">Update User password to</label>
                        <input type="password" className="form-control text-center" placeholder="Update Password Here" id="password" name="password" />
                        <br />

                        <button className="btn btn-lg btn-block" type="button" onClick={UpdateUser}>Update</button>
                    </form>
                </div>
            </>
        );
    }
}
export default React.memo(Update) 
