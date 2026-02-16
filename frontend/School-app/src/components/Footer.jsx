import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        
        <div className="footer-section about">
          <h3>About MarketPluse</h3>
          <p>
            MarketPluse is your one-stop platform for browsing and managing products seamlessly. 
            We provide a fast, secure, and user-friendly shopping experience.
          </p>
        </div>

        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>Categories</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>

      
        <div className="footer-section support">
          <h3>Support</h3>
          <ul>
            <li>FAQ</li>
            <li>Shipping & Delivery</li>
            <li>Returns & Refunds</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <p>Stay connected with us on social media</p>
          <div className="social-icons">
            <span className="icon">🌐</span>
            <span className="icon">📘</span>
            <span className="icon">📸</span>
            <span className="icon">🐦</span>
          </div>
        </div>

      </div>

      
      <div className="footer-bottom">
        © {new Date().getFullYear()} MarketPluse. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
