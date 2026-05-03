import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Footer from "../components/Footer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("BASE_URL is:", BASE_URL);

function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/Products/categories/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/Products/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFeatured(data.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="home">

        <section className="h-hero">
          <div className="h-hero-inner">
            <div className="h-hero-left">
              <div className="h-tag">💻 Nairobi's Leading Tech Store</div>
              <h1>
                Latest Tech,<br />
                Best <span>Prices Today</span>
              </h1>
              <p>
                Discover the latest laptops, phones, cameras & more at unbeatable prices.
                Enjoy <strong>Same Day Delivery </strong> within Nairobi
                and <strong>Next Day</strong> delivery across KENYA 🇰🇪
              </p>
              <div className="h-stats">
                <div className="h-stat">
                  <strong>50K+</strong>
                  <span>Happy Customers</span>
                </div>
                <div className="h-stat-divider" />
                <div className="h-stat">
                  <strong>5K+</strong>
                  <span>Tech Products</span>
                </div>
                <div className="h-stat-divider" />
                <div className="h-stat">
                  <strong>98%</strong>
                  <span>Satisfaction</span>
                </div>
              </div>
              <div className="h-hero-btns">
                <button className="h-btn-main" onClick={() => navigate("/products")}>
                  Shop Now →
                </button>
                <button className="h-btn-ghost" onClick={() => navigate("/products")}>
                  Browse Categories
                </button>
              </div>
              <div className="h-trust">
                <span>Genuine Products</span>
                <span>Secure Payments</span>
                <span>Easy Returns</span>
              </div>
            </div>
            <div className="h-hero-right">
              <div className="h-hero-img-wrap">
                <img src="/lkj.png" alt="Big Five Technologies" />
              </div>
              <div className="h-hero-badge-float h-badge-1">
                <span>⚡</span>
                <div>
                  <strong>Flash Sale</strong>
                  <p>Up to 20% off</p>
                </div>
              </div>
              <div className="h-hero-badge-float h-badge-2">
                <span>🚚</span>
                <div>
                  <strong>Fast Delivery</strong>
                  <p>Same Day</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-promo-bar">
          <div className="h-promo-track">
            <span>🚚 Free delivery on orders over Ksh 2,000</span>
            <span>•</span>
            <span>⚡ Flash sales every Friday</span>
            <span>•</span>
            <span>💻 Genuine tech products only</span>
            <span>•</span>
            <span>📞 24/7 Customer support — 0790 240220</span>
            <span>•</span>
            <span>🔒 100% Secure Checkout</span>
            <span>•</span>
            <span>✅ Authorized Dealer</span>
          </div>
        </div>

        <section className="h-cats-section">
          <div className="h-inner">
            <div className="h-section-head">
              <div>
                <p className="h-eyebrow">What are you looking for?</p>
                <h2>Shop by <span>Category</span></h2>
              </div>
              <button onClick={() => navigate("/products")}>View All →</button>
            </div>
            <div className="h-cats-grid">
              {categories.map(cat => (
                <div
                  key={cat.name}
                  className="h-cat-card"
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                >
                  <strong>{cat.name}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="h-why">
          <div className="h-inner">
            <div className="h-section-head centered">
              <div>
                <p className="h-eyebrow">Why choose us</p>
                <h2>The <span>Big Five Technologies</span> Difference</h2>
              </div>
            </div>
            <div className="h-why-grid">
              <div className="h-why-card">
                <div className="h-why-icon">🚀</div>
                <h3>Same Day Delivery</h3>
                <p>Order before 2PM and get your items delivered the same day within Nairobi.</p>
              </div>
              <div className="h-why-card">
                <div className="h-why-icon">🛡️</div>
                <h3>Genuine Products</h3>
                <p>Every product we sell is 100% genuine and sourced from authorized distributors.</p>
              </div>
              <div className="h-why-card">
                <div className="h-why-icon">💰</div>
                <h3>Best Prices</h3>
                <p>We work directly with suppliers to bring you the most competitive tech prices in Kenya.</p>
              </div>
              <div className="h-why-card">
                <div className="h-why-icon">🔄</div>
                <h3>Easy Returns</h3>
                <p>Not satisfied? Return your item within 7 days for a full refund. No questions asked.</p>
              </div>
            </div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="h-featured">
            <div className="h-inner">
              <div className="h-section-head">
                <div>
                  <p className="h-eyebrow">Hand picked for you</p>
                  <h2>Featured <span>Products</span></h2>
                </div>
                <button onClick={() => navigate("/products")}>View All →</button>
              </div>
              <div className="h-products-grid">
                {featured.map(product => (
                  <div
                    key={product.id}
                    className={`h-pcard ${product.is_sold ? "h-pcard-sold" : ""}`}
                    onClick={() => !product.is_sold && navigate(`/products/${product.id}`)}
                  >
                    <div className="h-pcard-img">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0].image
                            : "/placeholder.png"
                        }
                        alt={product.title}
                      />
                      {product.is_sold && (
                        <div className="h-sold-overlay"><span>SOLD OUT</span></div>
                      )}
                      {product.discount_percentage > 0 && !product.is_sold && (
                        <span className="h-pcard-badge">-{product.discount_percentage}%</span>
                      )}
                    </div>
                    <div className="h-pcard-body">
                      {product.subcategory && (
                        <span className="h-pcard-sub">{product.subcategory}</span>
                      )}
                      <h4>{product.title}</h4>
                      <div className="h-pcard-prices">
                        <span className="h-pcard-price">Ksh {Number(product.price).toLocaleString()}</span>
                        {product.old_price && product.discount_percentage > 0 && (
                          <span className="h-pcard-old">Ksh {Number(product.old_price).toLocaleString()}</span>
                        )}
                      </div>
                      {product.rating > 0 && (
                        <div className="h-pcard-rating">
                          <span>{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
                          <span>({product.rating})</span>
                        </div>
                      )}
                      <button
                        className={`h-pcard-btn ${product.is_sold ? "h-pcard-btn-off" : ""}`}
                        disabled={product.is_sold}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!product.is_sold) navigate(`/products/${product.id}`);
                        }}
                      >
                        {product.is_sold ? "Sold Out" : "View Details →"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-view-all">
                <button onClick={() => navigate("/products")}>View All Products →</button>
              </div>
            </div>
          </section>
        )}

        <section className="h-cta">
          <div className="h-cta-inner">
            <div className="h-cta-text">
              <h2>Ready to upgrade your tech?</h2>
              <p>Laptops, phones, cameras & more — unbeatable prices, fast delivery across Kenya.</p>
              <button onClick={() => navigate("/products")}>Browse All Products →</button>
            </div>
            <div className="h-cta-cards">
              {categories.slice(0, 4).map(cat => (
                <div
                  key={cat.name}
                  className="h-cta-card"
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                >
                  <strong>{cat.name}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

export default Home;