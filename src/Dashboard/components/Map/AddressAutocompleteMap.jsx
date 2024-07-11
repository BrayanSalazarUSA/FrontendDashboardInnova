import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';

const containerStyle = {
    width: '400px',
    height: '400px'
};



function AddressAutocompleteMap({ onSelectAddress }) {
    
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const onMapLoad = useCallback((map) => {
        setMap(map);
    }, []);
    const onMapClick = useCallback((event) => {
        const newMarkerPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        setMarker(newMarkerPosition);
        geocodeLatLng(newMarkerPosition);
    }, []);

    const geocodeLatLng = useCallback((latLng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    setSelectedAddress(results[0].formatted_address);
                    onSelectAddress(results[0].formatted_address);
                } else {
                    window.alert("No results found");
                }
            } else {
                window.alert("Geocoder failed due to: " + status);
            }
        });
    }, [onSelectAddress]);
    
    const { i18n } = useTranslation();
    const [center, setCenter] = useState({ lat: 25.7617, lng: -80.1918 }); 
    useEffect(() => {
        const newCenter = i18n.language === 'es' ? { lat: 4.5709, lng: -74.2973 } : { lat: 25.7617, lng: -80.1918 };
        setCenter(newCenter);
    }, [i18n.language]);


    return (
        <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onMapLoad}
                onClick={onMapClick}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
        </LoadScript>
    );
}


export default AddressAutocompleteMap;