import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {jwtDecode} from 'jwt-decode';
import { FaMapMarkerAlt, FaTag, FaClock, FaStar } from "react-icons/fa";
import "../styles/TripDetails.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NearbyPlaces from "../components/NearbyPlaces";
import TripRoute from "../components/TripRoute";     



const TripDetails = () => {
    
    const { tripId } = useParams(); // Get trip ID from the URL
    const [trip, setTrip] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);

        // Function to Get Coordinates from OpenStreetMap Nominatim API
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
    
        // Function to Fetch Nearby Restaurants & Hotels from Overpass API
        const fetchNearbyPlaces = async (lat, lon) => {
            try {
                const query = `
                    [out:json];
                    (
                        node["amenity"="restaurant"](around:3000, ${lat}, ${lon});
                        node["tourism"="hotel"](around:3000, ${lat}, ${lon});
                        node["amenity"="cafe"](around:3000, ${lat}, ${lon});
                    );
                    out;
                `;
    
                const response = await axios.get(`https://overpass-api.de/api/interpreter`, {
                    params: { data: query },
                });
    
                return response.data.elements.map((place) => ({
                    name: place.tags.name || "Unknown Place",
                    type: place.tags.amenity || place.tags.tourism || "Unknown",
                    lat: place.lat,
                    lon: place.lon,
                    rating: place.tags.rating ? parseFloat(place.tags.rating) : (Math.random() * 1.5 + 3).toFixed(1) // Mock rating if not available
                }));
            } catch (error) {
                console.error("Error fetching nearby places:", error);
                return [];
            }
        };

        const getFilteredPlaces = (type) => {
            return places
                .filter((place) => place.type === type)
                .sort((a, b) => b.rating - a.rating) // Sort by rating (highest first)
                .slice(0, 6); // Limit to top 6
        };

    useEffect(() => {
        const fetchData = async () => {
            // console.log("Fetched Trip:", trip); 
            if (!trip || !trip.locations || trip.locations.length === 0) {
                console.warn("No locations found for this trip.");
                return;
            }
            setLoading(true);

            try {
                //console.log("Fetching coordinates for location:", trip.locations[0]);
                const coords = await fetchCoordinates(trip.locations[0]);
                if (!coords) return;

                // 2️⃣ Fetch Nearby Places
                const nearbyPlaces = await fetchNearbyPlaces(coords.lat, coords.lon);
                setPlaces(nearbyPlaces);
            } catch (error) {
                console.error("Error loading places:", error);
            }

            setLoading(false);
        };

        fetchData();
    }, [trip]);
    const fetchComments = async () => {
        try {
            const response = await axios.get(`https://discoverbuddy.onrender.com/api/trips/${tripId}/comments`);
            // console.log("Fetched Comments:", response.data);
            setComments(response.data); // ✅ Updates comments dynamically
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    // Fetch trip details and comments
    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                // console.log("Trip id-",tripId);
                const tripResponse = await axios.get(`https://discoverbuddy.onrender.com/api/trips/${tripId}`);
                //console.log("Fetched Trip Details:", tripResponse.data);
                setTrip(tripResponse.data);
                const commentsResponse = await axios.get(`https://discoverbuddy.onrender.com/api/trips/${tripId}/comments`);
                
                setComments(commentsResponse.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTripDetails();
    }, [tripId]);

    const handleCommentSubmit = async (e) => {

        e.preventDefault();
        if (!newComment.trim()) {
            setError("Comment cannot be empty.");
            setTimeout(() => {
                setError(""); // Reset error message after 4 seconds
            }, 4000);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must be logged in to comment.");
                return;
            }
            const decoded = jwtDecode(token);
            const userId = decoded?.userId;
            //const username = decoded?.username;
            const response = await axios.post(
                `https://discoverbuddy.onrender.com/api/trips/${tripId}/comments`,
                { comment: newComment, userId: userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess("Comment added!");
            //setComments((prev) => [...prev, response.data.comment]);
            setNewComment("");
            fetchComments();
            setTimeout(() => {
                setSuccess("");
            }, 4000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add comment.");
            setTimeout(() => {
                setError("");
            }, 4000);
        }
    };

    const sliderSettings = {
        dots: true,  // Navigation dots
        infinite: trip?.images?.length > 1, // Loop through images
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: trip?.images?.length > 1,
        autoplaySpeed: 3000, // Change image every 3 seconds
        arrows:trip?.images?.length > 1,
    };

    return (
        <>
        <Header/>
        <div className="trip-details-container">
            {trip ? (
                <>
                    <h3>{trip.name}</h3>
                    {trip.images?.length > 0 && (
                            <Slider {...sliderSettings} className="trip-image-slider">
                                {trip.images.map((image, index) => (
                                    <div key={index}>
                                        <img
                                            src={`https://discoverbuddy.onrender.com${image.url}`}
                                            alt={`${trip.name} - Image ${index + 1}`}
                                            className="trip-image"
                                        />
                                    </div>
                                ))}
                            </Slider>
                    )}
                    <p className="trip-description">{trip.description}</p>
                    <h2>Top picks to Eat & Stay</h2>
                    {loading ? <p>Loading nearby places...</p> : (
                            <>
                                {/* Restaurants */}
                                {getFilteredPlaces("restaurant").length > 0 && (
                                    <>
                                        <h4>🍽️ Best Nearby Restaurants-</h4>
                                        <NearbyPlaces places={getFilteredPlaces("restaurant")} loading={loading} />
                                    </>
                                )}

                                {/* Hotels */}
                                {getFilteredPlaces("hotel").length > 0 && (
                                    <>
                                        <h4>🏨 Best Nearby Hotels -</h4>
                                        <NearbyPlaces places={getFilteredPlaces("hotel")} loading={loading} />
                                    </>
                                )}

                                {/* Cafes */}
                                {getFilteredPlaces("cafe").length > 0 && (
                                    <>
                                        <h4>☕ Best Nearby Cafes-</h4>
                                        <NearbyPlaces places={getFilteredPlaces("cafe")} loading={loading} />
                                    </>
                                )}
                            </>
                        )}
                    <div>
                        {/* Display Best Route to Trip Destination */}
                        {trip.locations.length > 0 ? (
                            <TripRoute trip={trip} />
                        ) : (
                            <p>No location available for this trip.</p>
                        )}
                    </div>
                    <div className="trip-info">
                        <div className="trip-info-item">
                            <FaMapMarkerAlt className="trip-icon" />
                            <span>{trip.locations.join(", ")}</span> 
                        </div>
                        
                        <div className="trip-info-item">
                            <FaTag className="trip-icon" />
                            <span>{trip.category}</span>
                        </div>

                        <div className="trip-info-item">
                            <FaClock className="trip-icon" />
                            <span>{trip.duration} days</span>
                        </div>

                        <div className="trip-info-item">
                            <FaStar className="trip-icon star-icon" />
                            <span>{trip.rating}</span>
                        </div>
                    </div>
                    <div className="comments-section">
                        <h5>Note - Your comment will be visible to everyone.</h5>
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment._id}>
                                    <strong>{comment.userId.username}:</strong> {comment.comment}
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                            ></textarea>
                            <button type="submit">Post Comment</button>
                        </form>
                        {error && <p className="error-message1">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                    </div>
                </>
            ) : (
                <p>Loading trip details...</p>
            )}
        </div>
        <Footer/>
        </>
    );
};
export default TripDetails;