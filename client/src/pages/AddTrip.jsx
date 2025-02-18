import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import "../styles/AddTrip.css"
import Rating from '@mui/material/Rating';
import { Stack } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AddTrip = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        duration: "",
        images: [],
        videos: [],
        rating: 2,
        location: "",
      });
    const [images, setImages] = useState([]);   
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [videos , setVideos] = useState([]);
    const [locations, setLocations] = useState([]); 

    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        if (!token) {
          navigate("/login"); // Redirect to login page if not logged in   
        }
      }, [navigate]);

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess("");
                setError("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Prevent negative values for "duration"
        if (name === "duration") {
            if (value === "" || (Number(value) > 0 && /^[0-9]*$/.test(value))) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
                setError(""); // Clear error when valid
            } else {
                setError("Duration must be a positive number.");
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    

    
    /* media*/
    const handleFileChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleVideoChange = (e) => {
        setVideos(Array.from(e.target.files));
    };

     const handleLocationChange = (e) => {
        setFormData({ ...formData, location: e.target.value });
    };

    const handleAddLocation = () => {
        if (formData.location) {
            setLocations((prevLocations) => [...prevLocations, formData.location]);
            setFormData((prevData) => ({
                ...prevData,
                location: "", // Reset location input after adding
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formToSend = new FormData();

        for (const key in formData) {
            formToSend.append(key, formData[key]);
          }
          // Append images
          images.forEach((image , index) => {
            formToSend.append("images", image);
          });
          videos.forEach((video) => formToSend.append("videos", video));

          // Append locations (make sure it's handled as an array)
          formToSend.append("locations", JSON.stringify(locations)); 
          try {
            //console.log([...formToSend.entries()]);
            const response = await axios.post(`https://discoverbuddy.onrender.com/api/auth/add-trip`, formToSend, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Important for file upload
              },
            });
            // console.log(response);
      
            if (response.status === 201) {
              setSuccess("Trip added successfully!");
              setFormData({
                name: "",
                description: "",
                location: "",
                category: "",
                duration: "",
                images: [],
                videos: [], // Reset images after successful submission
              });
              setImages([]);
              setVideos([]);
              setLocations([]);
            }
          } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
          }
        };

    return(
        <>
        <Header/>
        <div className="add-trip-container">
            <h2>Share your Experience</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Trip Title</label>
                    <input
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Trip name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea 
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter trip description"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                        <label htmlFor="add-location">Add Locations</label>
                        <input
                            type="text"
                            id="add-location"
                            name="location"
                            value={formData.location}
                            onChange={handleLocationChange}
                            placeholder="Enter location"
                        />
                        <button className='button01' type="button01" onClick={handleAddLocation}>Add Location</button>
                    </div>

                    <div className="locations-list">
                        <h4>Locations:</h4>
                        <ul>
                            {locations.map((location, index) => (
                                <li key={index}>{location}</li>
                            ))}
                        </ul>
                    </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select 
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Family">Family</option>
                        <option value="Solo Travel">Solo Travel</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration (days)</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="Enter duration in days"
                        min="1"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="images">Images</label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        accept="image/*"
                        multiple // Allow multiple file selection
                        onChange={handleFileChange}
                    />
                </div>
                <div className="image-preview-container">
                    {images.map((image, index) => (
                        <div className="image-preview" key={index}>
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                        </div>
                    ))}
                </div>
                {/* <div className="form-group">
                    <label htmlFor="videos">Videos</label>
                        <input
                            type="file"
                            id="videos"
                            name="videos"
                            accept="video/*"
                            multiple // Allow multiple video selection
                            onChange={handleVideoChange}
                        />
                </div> */}
                <div className="form-group1">
                    <label htmlFor="rating">Rate Your Experience</label>
                    <Stack spacing={1}>
                        <Rating name="size-medium" value={formData.rating || 0} onChange={(event,newValue) => setFormData({...formData, rating: newValue || 0})} defaultValue={2} />
                    </Stack>
                </div>
                <button type="submit" className="btn-primary0">Add Trip</button>   
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
        </>
    );
};

export default AddTrip;

