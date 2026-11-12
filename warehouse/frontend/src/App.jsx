import { useState } from "react";

const API_URL = "http://127.0.0.1:8001";

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Request failed.");
  }
  return data;
}

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function authorizedFetch(url, options = {}) {
    const sendWithToken = (token) => fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        token,
      },
    });

    let response = await sendWithToken(accessToken);
    if (response.status !== 401 || !refreshToken) {
      return response;
    }

    try {
      const refreshResponse = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: { "refresh-token": refreshToken },
      });
      const tokens = await readResponse(refreshResponse);
      setAccessToken(tokens.access_token);
      response = await sendWithToken(tokens.access_token);
      if (response.status === 401) {
        setAccessToken("");
        setRefreshToken("");
      }
      return response;
    } catch (error) {
      setAccessToken("");
      setRefreshToken("");
      throw error;
    }
  }

  async function getPackages(token = accessToken) {
    if (!token) {
      return;
    }

    try {
      const response = token === accessToken
        ? await authorizedFetch(API_URL + "/packages")
        : await fetch(API_URL + "/packages", { headers: { token } });
      setPackages(await readResponse(response));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function login(e) {
    e.preventDefault();
    const form = e.target;
    const query = new URLSearchParams({
      username: form.username.value,
      password: form.password.value,
    });

    try {
      const response = await fetch(`${API_URL}/login?${query}`, {
        method: "POST",
      });
      const tokens = await readResponse(response);
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);
      setErrorMessage("");
      await getPackages(tokens.access_token);
      form.reset();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function addPackage(e) {
    e.preventDefault();
    const form = e.target;
    const query = new URLSearchParams({
      name: form.name.value,
      destination: form.destination.value,
      weight: form.weight.value,
    });

    try {
      const response = await authorizedFetch(`${API_URL}/packages?${query}`, {
        method: "POST",
      });
      const data = await readResponse(response);
      setErrorMessage(data.message || "");
      form.reset();
      await getPackages();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function searchPackage() {
    try {
      const response = await authorizedFetch(`${API_URL}/packages/${packageId}`);
      setSelectedPackage(await readResponse(response));
      setErrorMessage("");
    } catch (error) {
      setSelectedPackage(null);
      setErrorMessage(error.message);
    }
  }

  return (
    <div>
      <h1>Warehouse Dispatch Management</h1>

      {!accessToken ? (
        <>
          <h2>Login</h2>
          <form onSubmit={login}>
            <input name="username" placeholder="Username" required />
            <br /><br />
            <input name="password" type="password" placeholder="Password" required />
            <br /><br />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <>
          <button onClick={() => {
            setAccessToken("");
            setRefreshToken("");
            setPackages([]);
            setSelectedPackage(null);
          }}>
            Log out
          </button>

          <h2>Add Package</h2>
          <form onSubmit={addPackage}>
            <input name="name" placeholder="Package Name" required />
            <br /><br />
            <input name="destination" placeholder="Destination" required />
            <br /><br />
            <input name="weight" type="number" placeholder="Weight" required />
            <br /><br />
            <button type="submit">Add Package</button>
          </form>

          <h2>All Packages</h2>
          <button onClick={() => getPackages()}>Refresh Packages</button>
          <ul>
            {packages.map((item) => (
              <li key={item.id}>
                {item.id} - {item.name} - {item.destination} - {item.weight} kg -
                {item.status}
              </li>
            ))}
          </ul>

          <h2>Search Package</h2>
          <input
            type="number"
            placeholder="Enter Package ID"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
          />
          <button onClick={searchPackage} disabled={!packageId}>Search</button>

          {selectedPackage && (
            <div>
              <h3>Package Details</h3>
              <p>ID: {selectedPackage.package_id}</p>
              <p>Name: {selectedPackage.name}</p>
              <p>Destination: {selectedPackage.destination}</p>
              <p>Weight: {selectedPackage.weight}</p>
              <p>Arrival Date: {selectedPackage.arrival_date}</p>
              <p>Status: {selectedPackage.status}</p>
            </div>
          )}
        </>
      )}

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}

export default App;
