import React from "react";
import "./footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="footerSection">
          <h1 className="logo">HealthMate</h1>
          <p className="desc">
           An AI-based medical assistant that analyzes uploaded health reports and explains the results in simple language. Users can also chat with the AI for better understanding.
          </p>
        </div>

        {/* Links */}
        <div className="footerSection">
          <h3>Quick Links</h3>
          <ul>
            <Link to="/home"><li>Home</li></Link>
            <Link to="about"><li>About</li></Link>
            <Link><li>Link 3</li></Link>
            <Link><li>Link 4</li></Link>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footerSection">
          <h3>Contact</h3>
          <p>Email: shahzaib607@gmail.com</p>
          <p>Phone: +92 340 3004439</p>
          <p>Karachi, Pakistan</p>
        </div>

        {/* Socials */}
        <div className="footerSection">
          <h3>Follow Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>

      <div className="footerBottom">
        <p>© {new Date().getFullYear()} Web Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;