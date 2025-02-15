import React from "react";
import Hero from "../components/HeroSection.jsx";
import Header from "../components/Header.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Testimonial from "../components/Testimonial.jsx";
import Footer from "../components/Footer.jsx";
import AboutUs from "../components/AboutUs.jsx";


const HomePage = () => {
    return (
      <div>
        <Header/>
        <Hero/> 
        <HowItWorks/>
        <Testimonial/>
        <AboutUs/>
        <Footer/>
      </div>
    );
  };

export default HomePage;