import React from "react";
import "../styles/PersonalizedRecommendations.css";

const PersonalizedRecommendations = () => {
  const recommendations = [
    "Mountain Adventures",
    "Beach Escapes",
    "Cultural Experiences",
    "Cultural Experiences",
  ];

  return (
    <section className="personalized-recommendations">
      <h2>Personalized Recommendations</h2>
      <div className="carousel">
        {recommendations.map((recommendation, index) => (
          <div className="carousel-item" key={index}>
            <h3>{recommendation}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;
