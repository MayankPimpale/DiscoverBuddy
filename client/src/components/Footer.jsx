import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>DiscoverBuddy</h2>
          <p>Your companion for discovering new adventures.</p>
        </div>


        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/explore">Explore</a></li>
            <li><a href="/add-trip">Add-Trip</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Extra Links</h3>
          <ul>
            <li><a>Need Help?</a></li>
            <li><a>About Us</a></li>
            <li><a>Privacy Policy</a></li>
            <li><a>Terms of Use</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Contact Info</h3>
          <ul>
            <li><a>Facebook</a></li>
            <li><a>Twitter</a></li>
            <li><a>Instagram</a></li>
            <li><a>Linkedin</a></li>
          </ul>
        </div>


        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@discoverbuddy.com</p>
          <p>Phone: +91 234 567 890</p>
          <p>Location: Nagpur</p>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2024 DiscoverBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
