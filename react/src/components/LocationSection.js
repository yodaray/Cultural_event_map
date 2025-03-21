import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GLB from "../Setting.js";
import Map from "./Maps.js";
import CommentGen from "./CommentSection.js";
import EventButtonGen from "./EventButtonSection.js";

const LocationSection = (props) => {
  const [Favorite_Status, SetFavorite_Status] = useState(false);
  let UserAc = props.UserAc;
  let UserName = props.UserName;
  let { locationId } = useParams();
  let locId = locationId;

  // Checking whether current location is user's favorite location
  if (Favorite_Status === false) {
    for (let i = 0; i < props.FavoriteDataSet.length; i++) {
      if (props.FavoriteDataSet[i].locationId === locationId) {
        SetFavorite_Status(true);
        break;
      }
    }
  }

  // Adding or removing the current location from favorites
  const SwitchFavorite = () => {
    let API = `${GLB.backend}/AddToFavorite/${locId}`;
    let Temp_favoriteObj = { userAc: UserAc, locationId: locId };
    fetch(API, {
      method: "PUT",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: new URLSearchParams(Temp_favoriteObj),
    })
      .then((res) => {
        if (res.ok) {
          console.log("PUT ok");
          props.setEnd(null);
        } else console.log("PUT NO");
        return res;
      })
      .then((res) => res.text())
      .then((action) => {
        if (action === "Add") {
          SetFavorite_Status(true);
        } else {
          SetFavorite_Status(false);
        }
      })
      .catch((error) => console.log(error));
  };

  let center = { lat: 0, lng: 0 };

  let index = 0;
  for (let i = 0; i < props.LocationDataset.length; i++) {
    if (props.LocationDataset[i].locationId == locationId) {
      center = {
        lat: props.LocationDataset[i].coordinates.lat,
        lng: props.LocationDataset[i].coordinates.lng,
      };
      index = i;
    }
  }

  // State variables for filter event IDs, names, prices, and trigger button
  const [filterEventId, setfilterEventId] = useState([]);
  const [filterEventName, setfilterEventName] = useState([]);
  const [passEventId, setPassEventId] = useState([]);
  const [passEventName, setPassEventName] = useState([]);
  const [passEventPrice, setPassEventPrice] = useState([]);
  const [triggerButton, setTriggerButton] = useState();

  // Flag for disabling minimap's Popup function
  const [PopUpflag, setPopUpFlag] = useState(true);

  // Flag for enabling and disabling the filter
  const [filterflag, setfilterflag] = useState(false);

  // Function to fetch event data and update state variables
  const eventButton = () => {
    let API = GLB.backend + "/Read/Location/" + locId;

    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        let eventButtonArray = [];
        let eventNameArray = [];
        let eventPriceArray = [];
        for (let i = 0; i < data.length; i++) {
          eventButtonArray.push(data[i].eventId);
          eventNameArray.push(data[i].title);
          eventPriceArray.push(data[i].priceNum);
        }

        setPassEventId(eventButtonArray);
        setPassEventName(eventNameArray);
        setPassEventPrice(eventPriceArray);
        setfilterEventId(eventButtonArray);
        setfilterEventName(eventNameArray);
      })
      .catch((err) => console.log(err));
    console.log("Done");
  };

  // Invoke eventButton function only once when triggerButton is null
  if (triggerButton == null) {
    eventButton();
    setTriggerButton(1);
  }

  const applyfilter = () => {
    setfilterflag(true);
    if (filterEventId.length != passEventId.length || filterEventName.length != passEventName.length) {
      setfilterEventId(passEventId);
      setfilterEventName(passEventName);
    }
    let limit = document.querySelector('#limit').value;
    if (limit === '' || isNaN(limit)) {
      window.alert("You must input a valid value in the cell.");
    }
    else {
      let num = parseInt(limit);
      let eventIdArray = [];
      let eventNameArray = [];
      for (let i = 0; i < passEventPrice.length; i++) {
        if (passEventPrice[i] <= num) {
          eventIdArray.push(passEventId[i]);
          eventNameArray.push(passEventName[i]);
        }
      }
      console.log(eventIdArray);
      console.log(eventNameArray);
      setfilterEventId(eventIdArray);
      setfilterEventName(eventNameArray);
      console.log(filterEventId);
      console.log(filterEventName);
    }
  }

  const resetfilter = () => { setfilterflag(false) }

  return (
    <React.Fragment>
      <div className="row">
        <section id="location" className="locationCard col-sm-12 col-md-4 col-log-4">
          <h2>Location Detail</h2>
          <div id="smallermap">
            <Map width="400px" height="200px" CoordinatesArray={[props.LocationDataset[index].coordinates]} LocationsArray={[props.LocationDataset[index].locationId]} center={center} ratio={15} PopUpflag={PopUpflag} />
          </div>
          <p>Location: {props.LocationDataset[index].name}</p>
          <p>Number of Events: {props.LocationDataset[index].EventCount}</p>
          <button type="button" id="FavoriteButton" className="locationButton" onClick={SwitchFavorite}>
            {Favorite_Status ? "Remove from your favorite location" : "Add to favorite location"}
          </button>
          <h2>Events detail</h2>
          <div id="showevent"></div>
        </section>
        <section id="location" className="commentCard col-sm-12 col-md-3 col-log-3">
          <h2>Comment</h2>
          <CommentGen LocationId={locationId} UserAc={UserAc} UserName={UserName} />
          <p></p>
        </section>
        <section id="location" className="location col-sm-12 col-md-3 col-log-3">
          <h2>Events</h2>
          <div id="eventlist" className="wrapper">
            {!filterflag
              ? passEventId.map((xeventId, i) => (
                <EventButtonGen Index={i} EventId={xeventId} EventName={passEventName[i]} EventDataset={props.EventDataset} setEnd={props.setEnd} />
              ))
              : filterEventId.map((xeventId, i) => (
                <EventButtonGen Index={i} EventId={xeventId} EventName={filterEventName[i]} EventDataset={props.EventDataset} setEnd={props.setEnd} />
              ))}
          </div>
          <section id="location" className="filter">
            <form>
              <h2>Find events price under:</h2>
              <input type="text" id="limit" />
            </form>
            <button type="button" className="filterButton" onClick={applyfilter}>
              Apply
            </button>
            <button type="button" className="filterButton" onClick={resetfilter}>
              Reset
            </button>
          </section>
        </section>
      </div>
    </React.Fragment>
  );
};

export default LocationSection;

