import axios from "axios"; //
import { useEffect, useState } from "react"; //
const url = import.meta.env.VITE_URL; //
import {MapContainer,TileLayer,Popup,Marker} from "react-leaflet"; //
import "leaflet/dist/leaflet.css"; //
import { icon, Icon } from "leaflet";
//import "./App.css";
import Swal from "sweetalert2";

function App() {
  const center = [13.838492331040143, 100.02533605919358];
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  const [deliveryZone, setDeliveryZone] = useState({
    lat: 13.82804643,
    lng: 100.04233271,
    radius: 1000,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url + "/api/stores");
        console.log(response.data);

        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  // function to calculate distance between 2 points using haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; //Eath radius in meters
    const phi_1 = (lat1 * Math.PI) / 180;
    const phi_2 = (lat2 * Math.PI) / 180;

    const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; //Distance in meters
  };
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(base_url + "/api/stores");
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStore();
  }, []);
  const LocationMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMyLocation({ lat, lng });
        console.log("Clicked at latitude:" + lat + " longitude: " + lng);
      },
    });
    return (
      <Marker position={[myLocation.lat, myLocation.lng]} icon={housingIcon}>
        <Popup>My Current Location</Popup>
      </Marker>
    );
  };
  const housingIcon = new Icon({
    iconUrl:
      "https://cdn-icons-png.freepik.com/256/619/619153.png?semt=ais_hybrid",
    iconSize: [38, 45], //size of the icon
  });
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longtitude,
      });
    });
  };
  const handleLocationCheck = () => {
    if (myLocation.lat === "" || myLocation.lng === "") {
      Swal.fire({
        title: "Error!",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    if (deliveryZone.lat === "" || deliveryZone.lng === "") {
      Swal.fire({
        title: "Error!",
        text: "Please enter your valid Store location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const distance = calculateDistance(
      myLocation.lat,
      myLocation.lng,
      deliveryZone.lat,
      deliveryZone.lng
    );
    console.log(distance);
    if (distance <= deliveryZone.radius) {
      Swal.fire({
        title: "Success",
        text: "You are within the delivery zone.",
        icon: "success",
        confirmButtonText: "OK",
      });
      //Suggestion nearby stores.....
    }
  };
  return (
    <>
      <div>
        <h1>Store Delivery Zone Checker</h1>
        <button onClick={handleGetLocation}>Get My Location</button>
        <button onClick={handleLocationCheck}>
          Check Delivery Availability
        </button>
        <div>
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "80vh", width: "80vw" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]} icon={housingIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>

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
