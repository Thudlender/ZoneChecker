import axios from "axios"; 
import { useEffect, useState } from "react"; 
const base_url = import.meta.env.VITE_URL; 
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
} from "react-leaflet"; 
import "leaflet/dist/leaflet.css"; 
import { icon, Icon } from "leaflet";
import "./App.css";
import Swal from "sweetalert2";

function App() {
  const center = [13.838492331040143, 100.02533605919358]; //NPRU
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
        const response = await axios.get(url + "/api/stores");
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log("Error fetching stores:", error);
      }
    };
    fetchStore();
  }, []);

   //ไอคอนบ้าน
  const housingIcon = new Icon({
    iconUrl:
      "https://img.icons8.com/stencil/32/exterior.png",
    iconSize: [32, 32], // ขนาดของไอคอน
  });

  //ไอคอนร้านค้า
  const defaultIcon = new Icon({
    iconUrl: "https://img.icons8.com/stencil/32/shop.png",   
    iconSize: [32, 32], 
  });

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
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    );
  };

  const selectedIcon = new Icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=21240&format=png&color=000000",
    iconSize: [25, 26],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const handleAddStore = async () => {
    if (myLocation.lat === "" || myLocation.lng === "") {
      Swal.fire({
        title: "Error!",
        text: "Please select a valid location to add a store.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }



    const newStore = {
      name: "New Store", // คุณสามารถปรับให้เป็นชื่อที่ต้องการ
      address: "New Address", // ปรับให้เป็นที่อยู่ที่ต้องการ
      lat: myLocation.lat,
      lng: myLocation.lng,
      direction: "New Direction", // ปรับให้เป็นลิงค์สำหรับการนำทาง
    };

    try {
      const response = await (base_url + "/api/stores", newStore); //ยังไม่รู้ต้องแก้ยังไง
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Store Added",
          text: "The store has been successfully added.",
          confirmButtonText: "OK",
        });
        // Update the store list after adding a new store
        setStores((prevStores) => [...prevStores, response.data]);
      }
    } catch (error) {
      console.error("Error adding store:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error adding the store.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
    if (!deliveryZone.lat === "" || !deliveryZone.lng === "") {
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
    if (distance <= deliveryZone.radius) {
      Swal.fire({
        icon: "success",
        title: "success",
        text: "You are within the delivery zone",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oh no!",
        text: "You are outside of the delivery zone",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div>
        <h1>Store Delivery Zone Checker</h1>
        <button 
        className="btn btn-outline btn-success" 
        onClick={handleGetLocation}>

          Get My Location

        </button>
        <button 
        className="btn btn-outline btn-info" 
        onClick={handleLocationCheck}>

          Check Delivery Availability

        </button>
        <button 
        className="btn btn-outline btn-warning" 
        onClick={handleAddStore}>

        Add Store at My Location

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
            

            {stores &&
              stores.map((store) => {
                return (
                  <Marker 
                  key={store.id} 
                  position={[store.lat, store.lng]}
                  icon={selectedStore === store.id ? selectedIcon : defaultIcon} // เปลี่ยนสีไอคอนตามร้านที่เลือก
                  eventHandlers={{
                    click: () => {
                      setDeliveryZone({
                        lat: store.lat,
                        lng: store.lng,
                        radius: 700, // สามารถปรับ radius ได้
                      });
                      setSelectedStore(store.id); // ตั้งค่าให้ร้านค้าที่ถูกเลือก
                      Swal.fire({
                        title: "Store Selected",
                        text: `You have selected ${store.name} as your delivery zone.`,
                        icon: "info",
                        confirmButtonText: "OK",
                      });
                    },
                  }}
                  >
                    <Popup>
                      <b>{store.name}</b>
                      <p>{store.address}</p>
                      <a href={store.direction}>Get Direction</a>
                    </Popup>
                  </Marker>
                );
              })}
              {myLocation.lat && myLocation.lng && <LocationMap/>}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default App;
