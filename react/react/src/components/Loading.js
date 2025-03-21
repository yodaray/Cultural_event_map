import React from 'react';
import { counting_event, GetEvents, GetLocations, GetFavorites, XMLData } from "./Get.js";

const Loading = (props) => {
    console.log(props.firstLoad);
    if (props.firstLoad == null || props.firstLoad == undefined) {
        let XML = XMLData();
        XML.then(next => {
            let Event = GetEvents();
            Event
                .then(EventData => {
                    let Location = GetLocations();
                    Location
                        .then(LocationData => {
                            let LocationEventSum = counting_event(EventData, LocationData);
                            props.SetLocation(LocationEventSum);
                            props.SetEvent(EventData);
                            let Favorite = GetFavorites(props.UserAC);
                            Favorite
                                .then(FavoriteData => {
                                    let FavoriteSum = counting_event(EventData, FavoriteData);
                                    props.SetFavorite(FavoriteSum);
                                    window.sessionStorage.setItem("FirstLoad", true);
                                    window.sessionStorage.setItem("LastUpdate", Date());
                                    props.setEnd(1);
                                });
                        });
                });
        });
    }
    // Only get from database
    else {
        let EventDataPromise = GetEvents();
        let LocationDataPromise = GetLocations();
        let FavoriteDataPromise = GetFavorites(props.UserAC);

        Promise.all([EventDataPromise, LocationDataPromise, FavoriteDataPromise])
            .then(([EventData, LocationData, FavoriteData]) => {
                let LocationEventSum = counting_event(EventData, LocationData);
                props.SetLocation(LocationEventSum);
                props.SetEvent(EventData);
                let FavoriteSum = counting_event(EventData, FavoriteData);
                props.SetFavorite(FavoriteSum);
                props.setEnd(1);
            });
    }

    return (
        <div className="text-center" style={{ marginTop: 30 + 'vh' }}>
            <button style={{ color: 'black', width: 40 + 'vw', fontSize: 5 + 'vw', border: 2 }} className="btn" type="button" disabled>
                <span className="spinner-border spinner-border-sm" style={{ width: 1 + 'em', height: 1 + 'em' }} role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </div>
    );
}

export default React.memo(Loading);