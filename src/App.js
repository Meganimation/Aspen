import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

const MainWrapper = styled.main`
  display: flex;
  align-items: center;
`;

const StyledNavWrapper = styled.header`

    height: 5em;
`

const StyledButton = styled.button`
    background-color: darkolivegreen;
    font-size: 15px;
    color: cornsilk;
    border-radius: 10px;
    padding: 12px;
    border-style: dotted;
    border-width: 2px;
    border-color: darkGray;
    height: 3em;

`;

const MapWrapper = styled.section`
  margin: auto;
  position: sticky;
`;

const StyledNav = styled.nav`
  z-index: 2;
  justify-content: space-around;
  display: flex;
  flex-direction: row;
  transition: 0.5s;
  position: absolute;
  height: 3em;
  top: 0px;
  right: 1px;
  width: 90%;
  right: ${(props) => (props.menu ? "-15vw" : "0")};
  opacity: ${(props) => (props.menu ? "0%" : "100%")};
`;

const loaderAnimation = keyframes`
 0% {
  transform: rotate(0deg);
  border: 36px solid #f3f3f3; 
  border-top: 36px solid darkGray;
 }
  100% {
    border: 6px solid #f3f3f3; 
    border-top: 6px solid darkGray; 
    transform: rotate(360deg);
  }
}
`;

const loaderAnimationRule = css`
  ${loaderAnimation} 1.5s infinite alternate;
`;

const Loader = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid lightGray;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  animation: ${loaderAnimationRule};
`;

function ErrorMessage({ error }) {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "50px",
          width: "50px",
          background: "red",
          borderRadius: "100px",
        }}
      >
        <h1
          style={{
            fontSize: "50px",
            textAlign: "center",
            color: "white",
            margin: "auto",
          }}
        >
          !
        </h1>
      </div>
      <h3 style={{ position: "inherit", marginTop: "60px" }}>
        {error.toString()}
      </h3>
    </section>
  );
}

function App() {
  const URL = 'https://raw.githubusercontent.com/aspencapital/candidate-project-ui-ux/master/data/coordinates.geojson'
  const position = [45.514242, -122.683175];

  const [data, setData] = useState(false);
  const [filteredData, setFilteredData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menu, setMenu] = useState(true);


  useEffect(() => {
    return (!data ? fetchStarbucksData() : null)
  }, [data]);

  const fetchStarbucksData = () => {


    return fetch(URL)
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
        setData(["error", err.message]);
      });
  };

  if (!data) return <Loader />;
  if (data[0] === "error") return (<><ErrorMessage error={data[1]} /><button onMouseUp={()=>{fetchStarbucksData()}}>Try Again</button></>);

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
    <main>
      <StyledNavWrapper>
      <StyledButton
        onClick={() => {
          setMenu(!menu);
        }}
      >
        {menu ? "Show Menu" : "Hide Menu"}
      </StyledButton>
      <StyledNav menu={menu}>
        <StyledButton
          onClick={() => {
            console.log(data);
          }}
        >
          Console log the data
        </StyledButton>

        <input
          placeholder={"eg. Cornell Road"}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <StyledButton
          onClick={() => {
            handleFilter();
          }}
        >
          search for a starbucks on {searchTerm}
        </StyledButton>
        <StyledButton
          onMouseDown={() => {
            setSearchTerm("All");
          }}
          onMouseUp={() => {
            handleFilter();
          }}
        >
          Search for all in your area
        </StyledButton>
      </StyledNav>
      </StyledNavWrapper>

      <MainWrapper>
        <MapWrapper>
          <MapContainer center={position} zoom={13} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredData.map((ele) => {
              return (
                <>
                  <Marker
                    key={ele.geometry.coordinates[1]}
                    position={[
                      ele.geometry.coordinates[1],
                      ele.geometry.coordinates[0],
                    ]}
                  >
                    <Popup
                      position={[
                        ele.geometry.coordinates[1],
                        ele.geometry.coordinates[0],
                      ]}
                    >
                      <address>
                        <b>{ele.properties.name}</b> <br />
                        <i>
                          {ele.properties.address}, <br />
                          {ele.properties.zipCode}, 
                        </i>
                        <i> {ele.properties.city} </i>
                      </address>
                    </Popup>
                  </Marker>
                </>
              );
            })}
            <Marker position={position}></Marker>
          </MapContainer>
        </MapWrapper>
      </MainWrapper>
    </main>
  );
}

export default App;
