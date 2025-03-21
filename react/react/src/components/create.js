
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import GLB from "../Setting.js";
import './CRUD_Style.css';

function Create(props) {
     let { Option } = useParams();
     //Creating Event
     if (Option == "Event") {

          const CreateEvent = (e) => {
               e.preventDefault();

               let data = new URLSearchParams();
               let API = GLB.backend + "/Create/Event";
               data.append("EventId", document.querySelector('#eventId').value);
               data.append("Title", document.querySelector('#title').value);
               data.append("LocationId", document.querySelector('#locationId').value);
               data.append("Date", document.querySelector('#date').value);
               data.append("Description", document.querySelector('#description').value);
               data.append("Presenter", document.querySelector('#presenter').value);
               data.append("Price", document.querySelector('#price').value);

               fetch(API, { method: "post", body: data })
                    .then(response => response.text())
                    .then(data => {
                         if (data.indexOf("created") != -1) {
                              window.alert(data);
                              props.setEnd(null);
                         }
                         else window.alert(data);
                    }
                    )
                    .catch(error => console.log(error));
          }

          return (
               <>
                    <div className="text-center">
                         <h2>Create Event</h2>

                         <form method="post">
                              <label htmlFor="eventId" className="d-none">Event Id</label>
                              <input type="text" className="form-control" placeholder="Event ID" id="eventId" name="eventId" />
                              <br />

                              <label htmlFor="title" className="d-none">Title</label>
                              <input type="text" className="form-control" placeholder="Event Title" id="title" name="title" />
                              <br />

                              <label htmlFor="locationId" className="d-none">Location ID</label>
                              <input type="text" className="form-control" placeholder="Location ID" id="locationId" name="locationId" />
                              <br />

                              <label htmlFor="date" className="d-none">Date</label>
                              <input type="text" className="form-control" placeholder="Event Date" id="date" name="date" />
                              <br />

                              <label htmlFor="description" className="d-none">Description</label>
                              <input type="text" className="form-control" placeholder="Description" id="description" name="description" />
                              <br />

                              <label htmlFor="presenter" className="d-none">Presenter</label>
                              <input type="text" className="form-control" placeholder="Presenter" id="presenter" name="presenter" />
                              <br />

                              <label htmlFor="price" className="d-none">Price</label>
                              <input type="text" className="form-control" placeholder="Price" id="price" name="price" />
                              <br />

                              <button className="btn btn-lg btn-block" style={{ width: 50 + "%", margin: 'auto', backgroundColor: 'navy', color: 'white' }} type="button" onClick={CreateEvent}>Create</button>
                         </form>
                    </div>
               </>
          );
     }

     //Creating Location
     if (Option == "Location") {

          const CreateLocation = (e) => {
               e.preventDefault();

               let data = new URLSearchParams();
               let API = GLB.backend + "/Create/Location";
               data.append("LocationId", document.querySelector('#locationId').value);
               data.append("Name", document.querySelector('#name').value);
               data.append("Latitude", document.querySelector('#latitude').value);
               data.append("Longitude", document.querySelector('#longitude').value);

               fetch(API, { method: "post", body: data })
                    .then(response => response.text())
                    .then(data => {
                         if (data.indexOf("created") != -1) {
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
                         <h2>Create Location</h2>

                         <form method="post">
                              <label htmlFor="locationId" className="d-none">Location ID</label>
                              <input type="text" className="form-control" placeholder="Location ID" id="locationId" name="locationId" />
                              <br />

                              <label htmlFor="name" className="d-none">Location Name</label>
                              <input type="text" className="form-control" placeholder="Location Name" id="name" name="name" />
                              <br />

                              <label htmlFor="latitude" className="d-none">Latitude</label>
                              <input type="text" className="form-control" placeholder="Latitude" id="latitude" name="latitude" />
                              <br />

                              <label htmlFor="longitude" className="d-none">Longitude</label>
                              <input type="text" className="form-control" placeholder="Longitude" id="longitude" name="longitude" />
                              <br />

                              <button className="btn btn-lg btn-block" type="button" onClick={CreateLocation}>Create</button>
                         </form>
                    </div>
               </>
          );
     }

     //Creating User
     if (Option == "User") {
          const CreateUser = (e) => {
               e.preventDefault();

               let data = new URLSearchParams();
               let API = GLB.backend + "/Create/User";
               data.append("UserName", document.querySelector('#userName').value);
               data.append("UserAc", document.querySelector('#userAc').value);
               data.append("Password", document.querySelector('#password').value);

               fetch(API, { method: "post", body: data })
                    .then(response => response.text())
                    .then(data => {
                         if (data.indexOf("created") != -1) {
                              window.alert(data);
                              props.setEnd(null);
                         }
                         else window.alert("user not created")
                    })
                    .catch(error => console.log(error));
          }

          return (
               <>
                    <div className="text-center">
                         <h2>Create User</h2>

                         <form method="post">
                              <label htmlFor="userName" className="d-none">Nickname</label>
                              <input type="text" className="form-control" placeholder="Nickname" id="userName" name="userName" />
                              <br />

                              <label htmlFor="userAc" className="d-none">Account</label>
                              <input type="text" className="form-control" placeholder="Account" id="userAc" name="userAc" />
                              <br />

                              <label htmlFor="password" className="d-none">Password</label>
                              <input type="password" className="form-control" placeholder="Password" id="password" name="password" />
                              <br />

                              <button className="btn btn-lg btn-block" type="button" onClick={CreateUser}>Create</button>
                         </form>
                    </div>
               </>
          );
     }
}

export default React.memo(Create);
