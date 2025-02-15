import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// 🗺 Step 1: Get User's Current Location
const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    reject("Unable to retrieve location");
                }
            );
        } else {
            reject("Geolocation is not supported in this browser");
        }
    });
};

// 📍 Step 2: Fetch Destination Coordinates Dynamically
const fetchCoordinates = async (destination) => {
    try {
        if (!destination) {
            throw new Error("Destination is required");
        }
        
        //console.log(`Fetching coordinates for location: ${destination}`);

        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: destination,
                format: "json",
                limit: 1,
            }
        });

        // console.log("Nominatim API Response:", response.data);

        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            // console.log(`Coordinates for ${destination}: lat=${lat}, lon=${lon}`);
            return { lat, lon };
        } else {
            throw new Error("Location not found");
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
};

// 🚗 Step 3: Fetch Route from OSRM API
const fetchRoute = async (userLat, userLon, destLat, destLon) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${destLon},${destLat}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];

            const distanceKm = (route.distance / 1000).toFixed(2);
            const durationMin = route.duration / 60;

            const hours = Math.floor(durationMin / 60); // Whole hours
            const minutes = Math.round(durationMin % 60); // Remaining minutes
            let approxDuration;
            if (hours > 0) {
                approxDuration = `${hours} hr ${minutes} min`;
            } else {
                approxDuration = `${minutes} min`;
            }
            return {
                coordinates: route.geometry.coordinates,
                distance: distanceKm,
                duration: approxDuration,
            };
        } else {
            throw new Error("No route found");
        }
    } catch (error) {
        console.error("Error fetching route:", error);
        return null;
    }
};

// 🗺 Main Component: TripRoute
const TripRoute = ({ trip }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [route, setRoute] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🏠 Get User's Current Location
                const userCoords = await getUserLocation();
                setUserLocation(userCoords);

                // 🌍 Ensure the trip has a location before fetching coordinates
                if (!trip || !trip.locations || trip.locations.length === 0) {
                    console.warn("No locations found for this trip.");
                    return;
                }

                const destination = trip.locations[0]; // 📍 Get first location
                //console.log(`Fetching coordinates for trip destination: ${destination}`);

                // 🗺 Fetch Destination Coordinates
                const destCoords = await fetchCoordinates(destination);
                if (!destCoords) return;
                setDestinationCoords(destCoords);

                // 🚗 Fetch Best Route
                const routeData = await fetchRoute(userCoords.lat, userCoords.lon, destCoords.lat, destCoords.lon);
                setRoute(routeData);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [trip]);

    return (
        <div>
            <h3>Shortest Route to {trip?.locations?.[0]}</h3>
            {route && (
                <div className="route-info">
                    <p><strong>Total Distance - </strong> {route.distance} km</p>
                    <p><strong>Estimated Time - </strong> {route.duration}</p>
                </div>
            )}
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* User Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lon]} />
                )}

                {/* Destination Marker */}
                {destinationCoords && (
                    <Marker position={[destinationCoords.lat, destinationCoords.lon]} />
                )}

                {/* Route Path */}
                {route && <Polyline positions={route.coordinates.map(([lon, lat]) => [lat, lon])} color="blue" />}
            </MapContainer>
            <h5>Note - Above map shows the shortest route availaible.</h5>
        </div>
    );
};

export default TripRoute;
