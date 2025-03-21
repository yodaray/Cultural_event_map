import React from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Maps = (props) => {
  const ratio = props.ratio || 11;
  const center = props.center || {
    lat: 22.3453,
    lng: 114.1372,
  };

  const leafletStyle = {
    width: props.width,
    height: props.height
  };

  const addMarker = (Coord, i) => {
    const LocationId = props.LocationsArray[i].locationId;
    const LocationSection = "/LocationSection/" + LocationId;

    if (props.PopUpflag == null || props.PopUpflag === undefined) {
      return (
        <Marker key={LocationId} position={Coord}>
          <Popup>
            <Link to={LocationSection}>View details</Link>
          </Popup>
        </Marker>
      );
    } else {
      return (
        <Marker key={LocationId} position={Coord} />
      );
    }
  };

  return (
    <MapContainer center={center} zoom={ratio} scrollWheelZoom={true} style={leafletStyle}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.CoordinatesArray.map(addMarker)}
    </MapContainer>
  );
};

export default React.memo(Maps);