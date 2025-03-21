import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import './CRUD_Style.css';

function CRUD() {
  let { Option } = useParams();

  return (<>
    <div className="container">
      <div className="row">
        <h2 className="edit_title my-3">Choose one from the following actions:</h2>
      </div></div>

    <div className="container">
      <div className="row">

        <div className="col-sm-12 col-md-3 my-3" >
          <Link to={"/Create/" + Option}><button type="button" className="btn btn-lg" >Create</button></Link>
        </div>
        <div className="col-sm-12 col-md-3 my-3" >
          <Link to={"/Read/" + Option}><button type="button" className="btn btn-lg" >Read</button></Link>
        </div>
        <div className="col-sm-12 col-md-3 my-3" >
          <Link to={"/Update/" + Option}><button type="button" className="btn btn-lg" >Update</button></Link>
        </div>
        <div className="col-sm-12 col-md-3 my-3" >
          <Link to={"/Delete/" + Option}><button type="button" className="btn btn-lg" >Delete</button></Link>
        </div>
      </div>
    </div>
  </>);

}

export default React.memo(CRUD) 
