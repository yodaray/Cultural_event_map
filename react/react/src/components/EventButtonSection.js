import React from 'react';

const EventButtonGen = (props) => {

    window.sessionStorage.setItem("EventFlag", 0);
    const EventButton = () => {
        let index = 0;
        for (let i = 0; i < props.EventDataset.length; i++) {
            if (props.EventDataset[i].eventId === props.EventId)
                index = i;
        }
        try {
            let str = "";
            str = "<p><b> Eventname: </b></p>" + props.EventDataset[index].title + "<br><br>" +
                "<p><b> Date: </b></p>" + props.EventDataset[index].date + "<br><br>" +
                "<p><b> Description: </b></p>" + props.EventDataset[index].description + "<br><br>" +
                "<p><b> Presenter: </b></p>" + props.EventDataset[index].presenter + "<br><br>" +
                "<p><b> Price: </b></p>" + props.EventDataset[index].price;
            document.querySelector("#showevent").innerHTML = str;
        }
        catch (error) {
            console.log(error);
        }
        window.sessionStorage.setItem("EventFlag", 1);
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <b style={{ color: 'darkcyan', fontSize: '12px' }}>{props.Index + 1}</b>
            <button type="button" className="btn btn-block eventbtn" onClick={EventButton}>{props.EventName}</button><br></br>
        </div>
    );
}

export default React.memo(EventButtonGen);