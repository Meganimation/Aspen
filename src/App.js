import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { device } from "./Breakpoints";

const MainWrapper = styled.main`
  display: flex;
  align-items: center;
`;

const StyledNavWrapper = styled.header`
  height: 5em;
  margin-top: 15px;
`;

const NavItem = styled.span`
`;

const StyledButton = styled.button`
  @media ${device.mobile} {
    height: 80px;
  }
  background-color: #a1615f;
  font-size: 15px;
  color: cornsilk;
  border-radius: 10px;
  padding: 12px;
  border-style: dotted;
  border-width: 1px;
  border-color: cornsilk;
  height: 3em;
`;

const StyledInput = styled.input`
  background: cornsilk;
  height: 3em;
  color: darkGray;
  border-style: dotted;
  border-radius: 10px;
  border-width: 1px;
  border-color: cornsilk;
`;

const MapWrapper = styled.section`
  margin: auto;
  position: sticky;
`;

const StyledNav = styled.nav`
  @media ${device.mobile} {
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: space-around;
    display: flex;
    flex-direction: column;
    transition: 0.5s;
    position: absolute;
    height: 100%;
    bottom: 0px;
    right: 1px;
    width: 40%;
    right: ${(props) => (props.menu ? "-15vw" : "0")};
    opacity: ${(props) => (props.menu ? "0%" : "100%")};
  }

  @media ${device.desktop} {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: right;
    transition: 0.5s;
    position: absolute;
    height: 3em;
    top: 0px;
    right: 1px;
    width: 90%;
    right: ${(props) => (props.menu ? "-15vw" : "0")};
    opacity: ${(props) => (props.menu ? "0%" : "100%")};
  }
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

const StyledFooter = styled.footer`
position: absolute;
background-color: rgba(0, 0, 0, 0.5);
bottom: 0;
`

const Facts = styled.i`
  margin-right: 9em;
`

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
  const URL =
    "https://raw.githubusercontent.com/aspencapital/candidate-project-ui-ux/master/data/coordinates.geojson";
  const position = [45.514242, -122.683175];

  const [data, setData] = useState(false);
  const [filteredData, setFilteredData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menu, setMenu] = useState(true);

  useEffect(() => {
    return !data ? fetchStarbucksData() : null;
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
  if (data[0] === "error")
    return (
      <>
        <ErrorMessage error={data[1]} />
        <button
          onMouseUp={() => {
            fetchStarbucksData();
          }}
        >
          Try Again
        </button>
      </>
    );

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

    !filteredStations.length
      ? alert(
          `'We cannot find a location including ${searchTerm}. Please try again`
        )
      : setFilteredData(filteredStations);

    console.log(data);

    return filteredStations;
  };

  let i = 0

  

    let coffeeFacts = ['The drink dates back to 800 A.D', 'Coffee beans are technically seeds', 'The Marquee HTML tag was deprecated ages ago but I still miss it.']

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
          <NavItem>
            <StyledInput
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
              search
            </StyledButton>
          </NavItem>
          <NavItem>
            <StyledButton
              onMouseDown={() => {
                setSearchTerm("All");
              }}
              onMouseUp={() => {
                handleFilter();
              }}
            >
              find all
            </StyledButton>
          </NavItem>
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
      {/* eslint-disable-next-line */}
      <StyledFooter><marquee style={{color: 'cornsilk'}}>{coffeeFacts.map(fact => (<><b>Did You Know?... </b> <Facts>{fact}</Facts> </>))}</marquee></StyledFooter>
    </main>
  );
}

export default App;
