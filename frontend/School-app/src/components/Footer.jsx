import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-inner">

          <div className="footer-brand">
            <div className="footer-logo">BigFive<span>Technologies</span></div>
            <p className="footer-tagline">
              Your trusted partner for laptops, phones, cameras, computers and home audio systems — delivered right to your door in Nairobi.
            </p>
            <div className="footer-socials">
              <a className="social-btn" href="#" aria-label="Website">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
              <a className="social-btn" href="#" aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a className="social-btn" href="#" aria-label="Instagram">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a className="social-btn" href="#" aria-label="Twitter">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() => navigate("/products")}>All Products</li>
                <li onClick={() => navigate("/products")}>Laptops & Computers</li>
                <li onClick={() => navigate("/products")}>Phones</li>
                <li onClick={() => navigate("/products")}>Cameras</li>
                <li onClick={() => navigate("/products")}>Home Audio</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Account</h4>
              <ul>
                <li onClick={() => navigate("/")}>Sign In</li>
                <li onClick={() => navigate("/")}>Register</li>
                <li onClick={() => navigate("/cart")}>My Cart</li>
                <li onClick={() => navigate("/orders")}>My Orders</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Help</h4>
              <ul>
                <li>FAQ</li>
                <li>Shipping & Delivery</li>
                <li>Returns & Refunds</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-inner footer-bottom-inner">
          <p>© {new Date().getFullYear()} <strong>Big Five Technologies</strong>. All rights reserved.</p>
          <p>Built with ❤️ in Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;