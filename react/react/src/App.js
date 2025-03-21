import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { UserProfileRead, UserNameChange, UserPasswordChange, Maps, Tables, LoginHandle, LocationSection, LogoutHandle, CRUD, CRUDIndex, Update, Delete, Read, Create, Loading, Home, Title } from './components/index.js';
import { useParams } from "react-router-dom";
import "./style.css";
import GLB from "./Setting.js";

function App(props) {
  const [EventData, setEvent] = useState();
  const [LocationData, setLocation] = useState();
  const [FavoriteData, setFavorite] = useState([]);
  const [end, setEnd] = useState();

  // Handling session state for login
  console.log(GLB.backend);
  let Login_Status = window.sessionStorage.getItem("Cookie");
  let Admin_Status = "false";
  let UserName = "";
  let UserAc = "";
  // Prompt to Loginpage
  if (Login_Status == null) {
    return <LoginHandle />;
  }
  Admin_Status = window.sessionStorage.getItem("Admin_Status");
  UserName = window.sessionStorage.getItem("UserName");
  UserAc = window.sessionStorage.getItem("UserAc");

  let firstLoad = window.sessionStorage.getItem("FirstLoad");

  // Direct to loading page if already logged in but data havnt ready yet
  if (Login_Status != null && end == null) {
    return <Loading UserAC={UserAc} SetLocation={setLocation} SetEvent={setEvent} SetFavorite={setFavorite} firstLoad={firstLoad} setEnd={setEnd} />;
  }

  // Only all those promise functions are resolved and start rendering everything
  if (end != null) {
    // Admin page
    if (Admin_Status == "true") {
      return (
        <BrowserRouter>
          <LogoutHandle userName={UserName} />
          <Title name={props.name} style={{ color: "red" }} />
          <div>
            <nav className="navbar navbar-expand-lg justify-content-center bg-light">
              <ul className="navbar-nav">
                <Link to="/">
                  {" "}
                  <li className="nav-item text-dark">Home</li>
                </Link>
                <Link to="/Table">
                  {" "}
                  <li className="nav-item text-dark">Table</li>
                </Link>
                <Link to="/Map">
                  {" "}
                  <li className="nav-item text-dark">Map</li>
                </Link>
                <Link to="/FavoriteLocations">
                  {" "}
                  <li className="nav-item text-dark">Favorite Location</li>
                </Link>
                <Link to="/CRUDIndex">
                  {" "}
                  <li className="nav-item text-dark">Admin Edit</li>
                </Link>
              </ul>
            </nav>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Table" element={<Table LocationDataSet={LocationData} />} />
            <Route path="/Map" element={<Map LocationDataSet={LocationData} />} />
            <Route path="/FavoriteLocations" element={<FavoriteLocations FavoriteDataSet={FavoriteData} />} />
            <Route path="/Loading" element={<Loading />} />
            <Route
              path="/LocationSection/:locationId"
              element={<LocationSection LocationDataset={LocationData} EventDataset={EventData} FavoriteDataSet={FavoriteData} UserName={UserName} UserAc={UserAc} setEnd={setEnd} />}
            />
            <Route path="/CRUD/:Option" element={<CRUD />} />
            <Route path="/CRUDIndex" element={<CRUDIndex />} />
            <Route path="/Create/:Option" element={<Create setEnd={setEnd} />} />
            <Route path="/Read/:Option" element={<Read EventDataSet={EventData} LocationDataSet={LocationData} />} />
            <Route path="/Update/:Option" element={<Update EventDataSet={EventData} LocationDataSet={LocationData} setEnd={setEnd} />} />
            <Route path="/Delete/:Option" element={<Delete setEnd={setEnd} />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </BrowserRouter>
      );
    }
    // Normal User page
    else {
      return (
        <BrowserRouter>
          <LogoutHandle userName={UserName} />
          <Title name={props.name} style={{ color: "red" }} />
          <div>
            <nav className="navbar navbar-expand-lg justify-content-center bg-light">
              <ul className="navbar-nav">
                <Link to="/">
                  {" "}
                  <li className="nav-item text-dark">Home</li>
                </Link>
                <Link to="/Table">
                  {" "}
                  <li className="nav-item text-dark">Table</li>
                </Link>
                <Link to="/Map">
                  {" "}
                  <li className="nav-item text-dark">Map</li>
                </Link>
                <Link to="/FavoriteLocations">
                  {" "}
                  <li className="nav-item text-dark">Favorite Location</li>
                </Link>
                <Link to="/UserPasswordChange">
                  {" "}
                  <li className="nav-item text-dark">Change Password</li>
                </Link>
                <Link to="/UserNameChange">
                  {" "}
                  <li className="nav-item text-dark">Change Nickname</li>
                </Link>
                <Link to="/UserProfileRead">
                  {" "}
                  <li className="nav-item text-dark">Show Profile</li>
                </Link>
              </ul>
            </nav>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Loading" element={<Loading />} />
            <Route path="/Table" element={<Table LocationDataSet={LocationData} />} />
            <Route path="/Map" element={<Map LocationDataSet={LocationData} />} />
            <Route path="/FavoriteLocations" element={<FavoriteLocations FavoriteDataSet={FavoriteData} />} />
            <Route path='/UserPasswordChange' element={<UserPasswordChange />} />
            <Route path='/UserNameChange' element={<UserNameChange />} />
            <Route path='/UserProfileRead' element={<UserProfileRead />} />
            <Route
              path="/LocationSection/:locationId"
              element={<LocationSection LocationDataset={LocationData} EventDataset={EventData} FavoriteDataSet={FavoriteData} UserAc={UserAc} UserName={UserName} setEnd={setEnd} />}
            />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </BrowserRouter>
      );
    }
  }
}

const NoMatch = () => {
  let location = useLocation();
  return (
    <div>
      <h3>
        Error 404. There is no page named <code>{location.pathname}</code>
      </h3>
    </div>
  );
};

const Table = (props) => {
  return (
    <section>
      <div className="container">
        <div className="row">
          <h2>
            <b>Table</b> <i className="bi bi-table"></i>
          </h2>
          <Tables LocationDataSet={props.LocationDataSet} />
        </div>
      </div>
    </section>
  );
};

const Map = (props) => {
  let CoordinatesArray = [];
  let LocationsArray = [];
  for (let i = 0; i < props.LocationDataSet.length; i++) {
    CoordinatesArray.push({
      lat: props.LocationDataSet[i].coordinates.lat,
      lng: props.LocationDataSet[i].coordinates.lng
    });
    LocationsArray.push({
      locationId: props.LocationDataSet[i].locationId
    });
  }
  return (
    <section className="justify-content-center" id="map">
      <Maps width="700px" height="500px" CoordinatesArray={CoordinatesArray} LocationsArray={LocationsArray} />
    </section>
  );
};

const FavoriteLocations = (props) => {
  return (
    <section>
      <div className="container">
        <div className="row">
          <h2>
            <b>Your Favorite Location</b>
            <i></i>
          </h2>
          <Tables LocationDataSet={props.FavoriteDataSet} />
        </div>
      </div>
    </section>
  );
};

export default App;