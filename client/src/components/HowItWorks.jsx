import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HowItWorks.css";


const HowItWorks = () => {
  const navigate = useNavigate();

  const handleAddTrip = () => {
    navigate('/add-trip');
  }

  const handleExplore = () => {
    navigate('/explore');
  }
    return (
        <section className="how-it-works">
            <h2 className="section-title">How It Works?</h2>
            <div className="steps-container">
                <div className="step-card" onClick={handleAddTrip}>
                        <div className="icon" >🖋️</div>
                        <h3>Share Your Experiences</h3>
                        <p>Write detailed itineraries, upload photos, and rate your trips to help others.</p>
                </div>
                <div className="step-card" onClick={handleExplore}>
                        <div className="icon" >🔍</div>
                        <h3>Explore Recommendations</h3>
                        <p>Browse through crowdsourced travel stories to find your next destination.</p>
                </div>
                <div className="step-card">
                        <div className="icon">📅</div>
                        <h3>Plan Your Trip</h3>
                        <p>Use insights from the community to organize your perfect travel itinerary.</p>
                </div>
            </div>
        </section>
    );
};


export default HowItWorks;
