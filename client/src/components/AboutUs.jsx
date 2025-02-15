import React from "react";
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <section className="about-us">
      <div className="about-container">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Welcome to <strong>DiscoverBuddy</strong>, your go-to platform for sharing and discovering unique travel experiences. 
            Our mission is to create a vibrant community of travelers who inspire one another by sharing itineraries, 
            hidden gems, and stories from their journeys.
          </p>
          <p>
            Whether you're a solo adventurer, a family traveler, or a group of friends exploring the world, 
            DiscoverBuddy is here to help you plan your next adventure with ease. Join us in building a network 
            where every traveler’s story matters.
          </p>
        </div>
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMzfHx8ZW58MHx8fHx8"
            alt="About us"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
