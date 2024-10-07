import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./App.css";
import { Popup } from "leaflet";
const base_url = import.meta.env.VITE_API_BASE_URL;
function App() {
  const center = [13.838492331040143, 100.02533605919358]; //SE NPRU
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(base_url + "/api/stores");
        //console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStore();
  }, []);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longtitude,
      });
    });
  };

  return (
    <>
      <div>
        <h1>Store Delivery Zone Checker</h1>
        <div>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "75vh", width: "100vw" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/**Display my Location */}
            <Marker
              position={[myLocation.lat, myLocation.lng]}
              icon={housingIcon}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>

            {/**Display all stores on Map */}
            {stores &&
              stores.map((store) => {
                return (
                  <Marker position={[store.lat, store.lng]}>
                    <Popup>
                      <b>{store.name}</b>
                      <p>{store.address}</p>
                      <a href={store.direction}>Get Direction</a>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default App;
