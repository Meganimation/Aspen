import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


const position = [51.505, -0.09]


function App() {
  return (
    <div>
      <h1>Time 4 Topology</h1>

      <div>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
      </div>
    </div>
  );
}

export default App;
