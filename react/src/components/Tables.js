import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Generating table row
const Row = (props) => {
  const { index, LocationDataSet } = props;
  const locationLink = `/LocationSection/${LocationDataSet[index].locationId}`;
  return (
    <tr>
      <td>
        <Link to={locationLink}>{LocationDataSet[index].name}</Link>
      </td>
      <td>{LocationDataSet[index].EventCount}</td>
    </tr>
  );
};

// Main component
const Tables = (props) => {
  const [terms, setTerms] = useState("");
  const [result, setResult] = useState([]);
  const [option, setOption] = useState("");

  const processInput = (e) => {
    setTerms(e.target.value);
  };

  const processSort = (e) => {
    setOption(e.target.value);
  };

  const filterData = (data) => {
    return data.name.toLowerCase().includes(terms.toLowerCase());
  };

  const sortByChoice = (item1, item2) => {
    if (option === "name") {
      return item1.name.localeCompare(item2.name);
    } else if (option === "ascendingNumber") {
      return parseInt(item1.EventCount) - parseInt(item2.EventCount);
    } else if (option === "descendingNumber") {
      return parseInt(item2.EventCount) - parseInt(item1.EventCount);
    }
    return 0;
  };

  useEffect(() => {
    const filteredResults = props.LocationDataSet.filter(filterData);
    const sortedResults = [...filteredResults].sort(sortByChoice);
    setResult(sortedResults);
  }, [terms, option]);

  return (
    <main>
      <div className="main">
        <div className="form-group has-search">
          <span className="fa fa-search form-control-feedback"></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            onChange={processInput}
            value={terms}
          />
        </div>
        <br />
        <p>Sort by: </p>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="Option"
            id="noSort"
            value="none"
            onChange={processSort}
          />
          <label className="form-check-label" htmlFor="noSort">
            None
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="Option"
            id="nameSort"
            value="name"
            onChange={processSort}
          />
          <label className="form-check-label" htmlFor="nameSort">
            Name
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="Option"
            id="ascendingNumberSort"
            value="ascendingNumber"
            onChange={processSort}
          />
          <label className="form-check-label" htmlFor="ascendingNumberSort">
            Ascending Number
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="Option"
            id="descendingNumberSort"
            value="descendingNumber"
            onChange={processSort}
          />
          <label className="form-check-label" htmlFor="descendingNumberSort">
            Descending Number
          </label>
        </div>
      </div>
      <br />
      <div>
        <table
          id="example"
          className="table table-striped table-dark table-hover"
        >
          <thead>
            <tr>
              <th scope="col">Location</th>
              <th scope="col">Number of events</th>
            </tr>
          </thead>
          <tbody>
            {result.map((data, index) => (
              <Row key={index} index={index} LocationDataSet={result} />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default React.memo(Tables);