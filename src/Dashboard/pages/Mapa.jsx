import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
/* SER CUIDADOSO CON LA LINEA 16, leaflet-rotatedmarker GENERA UN ERROR AL SUBIR EL BUILD 
AL HOSTING SI EL COMPONENTE NO ESTA EN EL <Route path="/dashboard/mapa" element={<Mapa />} /> */
import "leaflet-rotatedmarker";
import "leaflet/dist/leaflet.css";
import { Header } from "../components";
import { CRS, Icon } from "leaflet";
import Dome from "../../assets/video-camera (1).png";
import PTZ from "../../assets/PTZ.png";
import offile from "../../assets/offline.jpg"
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import useFetchProperties from "../Hooks/useFetchProperties";
import { getCameras } from "../helper/getCameras";
import TypewriterText from "../components/Texts/TypewriterTex";
import { useTranslation } from "react-i18next";
/* Glorieta */

let skater = new Icon({
  iconUrl: Dome,
  iconSize: [21, 21],
});


const RotatedMarker = forwardRef(({ children, ...props }, forwardRef) => {
  const markerRef = useRef();

  const { rotationAngle, rotationOrigin } = props;

  const marker = markerRef.current;
  if (marker) {
    marker.setRotationAngle(rotationAngle);
    marker.setRotationOrigin(rotationOrigin);
  }

  return (
    <Marker
      ref={(ref) => {
        markerRef.current = ref;
        if (forwardRef) {
          forwardRef.current = ref;
        }
      }}
      {...props}
    >
      {children}
    </Marker>
  );
});
export const Mapa = () => {

  const navigate = useNavigate();
  const [camerasList, setCamerasList] = useState([]);

  const { propertyContext, setPropertyContext, cameraSaved, setCameratSaved } = useContext(UserContext);
  
  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;
  let map = `${process.env.REACT_APP_S3_BUCKET_URL}/${propertyStorage.mapImg}`;



  // Traducciones
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    getCameras(propertyContext.id || id, navigate).then((data) =>{
      setCamerasList(data);
      console.log(data);}
    );

 
  }, [propertyContext, cameraSaved])
  

  var bounds = [
    [0, -200],
    [700, 800] /* 500, 1000 */,
  ];

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        // setState your coords here
        // coords exist in "e.latlng.lat" and "e.latlng.lng"
        /* Longitud , Latidud */
        console.log(e.latlng.lng);
        console.log(e.latlng.lat);
        console.log(camerasList)
      },
     
    });
    return false;
  };

  return (
    <>
      <div className="mx-5 bg-white  overflow-auto rounded-3xl">
        {/* <Header category="Map | Cameras" title={`${propertyContext.name} Map`}/> */}
        <div className="h-32 mt-3 background ">

        <Header title={<TypewriterText text={t(`${propertyContext.name} - Map`)} />} />
        </div>

        <MapContainer
          /* y 750/2 ,x */
          center={[355, 295]}
          zoom={0}
          dragging={false}
          scrollWheelZoom={false}
          crs={CRS.Simple}
          style={{ height: "700px", width: "100%", overflow: "visible" }}
        >
          <ImageOverlay
           url={map || ""}
            bounds={bounds}
            
          />
           {
          
          /* camerasList?.map((element, index) => {
          
            let camera = element
            if (element.type === "Dome") {
              console.log(element.type)
              skater = new Icon({
                iconUrl: Dome,
                iconSize: [30, 30],
              });
            }
            if (element.type === "PTZ") {
              skater = new Icon({
                iconUrl: PTZ,
                iconSize: [25, 25],
              });
            }

            return (
              <RotatedMarker
                key={index}
                position={[ element.lat|| 0, element.lon || 0]}
              
                eventHandlers={{
                  mouseover: (event) => event.target.openPopup(),
                  mouseout: (event) => event.target.closePopup(),
                }}
                autoPan={false}
                icon={skater}
                rotationAngle={element.rotation || 0}
                rotationOrigin="center"
              >
                <Popup
                  minWidth={270}
                  className=" flex justify-center items-center"
                  autoPan={false}
                >
                  <div className="w-full flex flex-col m-0 p-0 items-center">
                    <img
                      className="w-full"
                      src={
                        `${process.env.REACT_APP_S3_BUCKET_URL}/${element?.image}`||
                        offile
                      }
                      alt="Sunset in the mountains"
                    />

                    <p className="font-normal m-0 p-0 text-gray-300">
                      {element.name}
                    </p>
                  </div>
                </Popup>
              </RotatedMarker>
            );
          }
          
          ) */
          
          } 
          <MapEvents />
        </MapContainer>
      </div>
    </>
  );
};