// src/components/Hero.js
import React from "react";
import "../styles/Hero.css";
import { useNavigate} from "react-router-dom";
import { useEffect , useState } from "react";

const Hero = () => {

  const navigate = useNavigate();
  

  const handleRouteToExplore = () => {
    navigate("/explore");
  }

  const handleRouteToAddTrip = () => {
    navigate("/add-trip");
  }

  const text = "Plan Your Next Adventure with DiscoverBuddy";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      } else {
        // Reset after the text is fully typed
        setTimeout(() => {
          setTypedText("");
          setIndex(0);
        }, 2000); // Pause before restarting
      }
    }, 100); // Typing speed

    return () => clearTimeout(timeout);
  }, [index, text]);
  return (
    <section className="hero">
      <div className="hero-content" id="intro-animation">
        <h1 className="hero-title" >{typedText}</h1>
        <p className="hero-subtitle">
          Explore crowd-sourced itineraries, real traveler experiences, and insider tips to make your trips unforgettable.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleRouteToExplore}>Explore Trips</button>
          <button className="btn-secondary" onClick={handleRouteToAddTrip}>Share Your Experience</button>
        </div>
      </div>
      <div className="hero-image">
        <img src="https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Travel Inspiration"
        />
      
      </div>
    </section>
  );
};

export default Hero;
