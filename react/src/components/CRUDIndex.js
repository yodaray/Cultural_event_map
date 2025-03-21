import React from 'react';
import Middle from '../index.js'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './CRUD_Style.css';

function CRUDIndex() {

  return (<>
    <div className="container">
      <div className="row">
        <h2 className="edit_title my-3" >Choose the data you need to edit:<i className="bi bi-pencil-square"></i></h2>
      </div>
    </div>

    <div className="container">
      <div className="row">
        <div className="col-4 my-3" >
          <Link to="/CRUD/Event"><button type="button" className="btn btn-lg" >Events</button></Link>
        </div>
        <div className="col-4 my-3" style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/CRUD/Location"><button type="button" className="btn btn-lg" style={{ width: "100%", height: "100%" }}>Locations</button></Link>
        </div>
        <div className="col-4 my-3" >
          <Link to="/CRUD/User"><button type="button" className="btn btn-lg" >Users</button></Link>
        </div>
      </div>
    </div>
  </>);

}

export default React.memo(CRUDIndex) 
