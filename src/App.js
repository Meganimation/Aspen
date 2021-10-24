import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useState, useEffect } from "react";

function App() {
  const position = [45.514242, -122.683175];

  const [data, setData] = useState(false);
  const [filteredData, setFilteredData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("Cornell Rd");

  useEffect(() => {
    return !data ? fetchStarbucksData() : null;
  }, [data]);

  const fetchStarbucksData = () => {
    let urlWithString = `https://raw.githubusercontent.com/aspencapital/candidate-project-ui-ux/master/data/coordinates.geojson`;

    return fetch(urlWithString)
      .then((res) => {
        if (!res.ok) {
          throw Error(`Error code: ${res.status}. Please try again.`);
        }
        return res.json();
      })
      .then((data) => {
        setFilteredData(data.features);
        setData(data.features);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  if (!data) return <section>Loading...</section>;

  const handleFilter = () => {
    console.log("filtering", searchTerm);

    const filteredStations =
      searchTerm.toUpperCase() === "ALL"
        ? data
        : data.filter((ele) =>
            ele.properties.address
              .toUpperCase()
              .includes(searchTerm.toUpperCase())
          );

    setFilteredData(filteredStations);

    console.log(data);

    return filteredStations;
  };

  return (
    <section>
      <header>Hello!</header>
      <button
        onClick={() => {
          console.log(data);
        }}
      >
        Console log the data
      </button>

      <input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <button
        onClick={() => {
          handleFilter();
        }}
      >
        search for a starbucks on {searchTerm}
      </button>

      <div>
        <MapContainer center={position} zoom={13} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredData.map((ele) => {
            return (
              <Marker
                key={ele.geometry.coordinates[1]}
                position={[
                  ele.geometry.coordinates[1],
                  ele.geometry.coordinates[0],
                ]}
              ></Marker>
            );
          })}
          <Marker position={position}>
            <Popup>
              Apparently. <br /> I can customize this.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}

export default App;
