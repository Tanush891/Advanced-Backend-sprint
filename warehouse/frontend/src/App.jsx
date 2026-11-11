
import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8001";

function App() {

  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);


  // Get all packages
  function getPackages() {

    fetch(API_URL + "/packages")
      .then(response => response.json())
      .then(data => setPackages(data));

  }


  useEffect(() => {
    getPackages();
  }, []);


  // Add a new package
  function addPackage(e) {

    e.preventDefault();

    const form = e.target;

    const url = API_URL + "/packages?package_name=" +
      encodeURIComponent(form.package_name.value) +
      "&destination=" + encodeURIComponent(form.destination.value) +
      "&weight=" + encodeURIComponent(form.weight.value) +
      "&arrival_date=" + encodeURIComponent(form.arrival_date.value);

    fetch(url, {
      method: "POST"
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || data.detail);
        getPackages();
        form.reset();
      });

  }


  // Search package by ID
  function searchPackage() {

    fetch(API_URL + "/packages/" + packageId)
      .then(response => response.json())
      .then(data => {

        if (data.detail) {
          alert(data.detail);
          setSelectedPackage(null);
        } else {
          setSelectedPackage(data);
        }

      });

  }


  return (

    <div>

      <h1>Warehouse Dispatch Management</h1>

      <h2>Add Package</h2>

      <form onSubmit={addPackage}>

        <input
          name="package_name"
          placeholder="Package Name"
          required
        />

        <br /><br />

        <input
          name="destination"
          placeholder="Destination"
          required
        />

        <br /><br />

        <input
          name="weight"
          placeholder="Weight"
          required
        />

        <br /><br />

        <input
          name="arrival_date"
          type="date"
          required
        />

        <br /><br />

        <button type="submit">Add Package</button>

      </form>


      <h2>All Packages</h2>

      <button onClick={getPackages}>
        Refresh Packages
      </button>

      <ul>

        {packages.map(item => (

          <li key={item.id}>
            {item.id} - {item.package_name} -
            {item.destination} - {item.weight} kg -
            {item.status}
          </li>

        ))}

      </ul>


      <h2>Search Package</h2>

      <input
        type="number"
        placeholder="Enter Package ID"
        value={packageId}
        onChange={e => setPackageId(e.target.value)}
      />

      <button onClick={searchPackage} disabled={!packageId}>
        Search
      </button>


      {selectedPackage && (

        <div>

          <h3>Package Details</h3>

          <p>ID: {selectedPackage.id}</p>
          <p>Name: {selectedPackage.package_name}</p>
          <p>Destination: {selectedPackage.destination}</p>
          <p>Weight: {selectedPackage.weight}</p>
          <p>Arrival Date: {selectedPackage.arrival_date}</p>
          <p>Status: {selectedPackage.status}</p>

        </div>

      )}

    </div>

  );

}

export default App;
