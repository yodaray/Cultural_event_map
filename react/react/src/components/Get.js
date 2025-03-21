import { resolvePath } from "react-router";
import GLB from "../Setting.js";

const XMLData = () => {
  let API = GLB.backend + "/data";
  return new Promise(resolve => {
    fetch(API, {
      method: 'PUT'
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((error) => console.log(error));
  });
}

const Process = (data, type) => {
  let Data = [];
  let Location = [];
  if (type === "event") {
    let jsonD = JSON.parse(data);
    Data = jsonD;
    return Data;
  }
  else if (type === "location") {
    let jsonD = JSON.parse(data);
    Location = jsonD;
    return Location;
  }
}

const counting_event = (events, locations) => {
  let Loc = locations;
  for (let i = 0; i < locations.length; i++) {
    let counter = 0;
    for (let j = 0; j < events.length; j++) {
      if (events[j].venue === Loc[i]._id) {
        counter++;
      }
    }
    Loc[i].EventCount = counter;
  }
  return Loc;
}

const GetEvents = () => {
  let API = GLB.backend + "/GetEvent";
  return new Promise(resolve => {
    fetch(API)
      .then((res) => res.text())
      .then((text) => {
        let result = Process(text, "event");
        resolve(result);
      })
      .catch((error) => console.log(error));
  });
}

const GetLocations = () => {
  let API = GLB.backend + "/GetLocation";
  return new Promise(resolve => {
    fetch(API)
      .then((res) => res.text())
      .then((text) => {
        let result = Process(text, "location");
        resolve(result);
      })
      .catch((error) => console.log(error));
  });
}

const GetFavorites = (userAc) => {
  let API = GLB.backend + "/GetFavorite/" + userAc;
  return new Promise(resolve => {
    fetch(API)
      .then((res) => res.json())
      .then((text) => {
        resolve(text);
      })
      .catch((error) => console.log(error));
  });
}

export { GetEvents, GetLocations, GetFavorites, counting_event, Process, XMLData };