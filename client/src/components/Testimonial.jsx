import React from "react";
import "../styles/Testimonials.css"


const Testimonial = () => {
    const testimonials = [
        {
            id: 1,
            name: "Jane Doe",
            image: "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            feedback: "DiscoverBuddy helped me plan the perfect trip. I found hidden gems I wouldn't have known otherwise!",
            location: "New York, USA",
          },
          {
            id: 2,
            name: "John Smith",
            image: "https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            feedback: "A fantastic platform! The community's insights made my vacation unforgettable.",
            location: "London, UK",
          },
          {
            id: 3,
            name: "Sara Lee",
            image: "https://images.pexels.com/photos/635512/pexels-photo-635512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            feedback: "I loved the detailed itineraries and tips from other travelers. It saved me so much time!",
            location: "Sydney, Australia",
          },
    ];
    return (
        <section className="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <p className="testimonial-location">{testimonial.location}</p>
              <p className="testimonial-feedback">"{testimonial.feedback}"</p>
            </div>
          ))}
        </div>
      </section>
    );
};


export default Testimonial;