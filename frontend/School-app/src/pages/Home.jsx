import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Footer from "../components/Footer";

function Home() {
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { name: "Electronics", icon: "💻", desc: "Laptops, Phones & More" },
    { name: "Fashion", icon: "👗", desc: "Clothing, Shoes & Bags" },
    { name: "Home", icon: "🏠", desc: "Furniture & Decor" },
    { name: "Jewellery", icon: "💍", desc: "Rings, Watches & More" },
    { name: "Sports", icon: "⚽", desc: "Fitness & Outdoor" },
    { name: "Drinks", icon: "🥤", desc: "Snacks & Beverages" },
  ];

  useEffect(() => {
    fetch("http://127.0.0.1:8000/Products/")
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
              <div className="h-tag">🔥 Nairobi's Favourite Online Store</div>
              <h1>
                Shop Smart,<br />
                Save <span>Big Today</span>
              </h1>
              <p>
                Discover thousands of products at unbeatable prices.
                Enjoy <strong>Same Day Delivery 🛵</strong> within Nairobi
                and <strong>Next Day</strong> delivery across KENYA 🇰🇪
              </p>
              <div className="h-stats">
                <div className="h-stat">
                  <strong>50K+</strong>
                  <span>Happy Customers</span>
                </div>
                <div className="h-stat-divider" />
                <div className="h-stat">
                  <strong>12K+</strong>
                  <span>Products</span>
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
                <span>✅ Verified Sellers</span>
                <span>🔒 Secure Payments</span>
                <span>📦 Easy Returns</span>
              </div>
            </div>
            <div className="h-hero-right">
              <div className="h-hero-img-wrap">
                <img src="/lkj.png" alt="Shop" />
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
            <span>🎁 Gift wrapping available</span>
            <span>•</span>
            <span>📞 24/7 Customer support</span>
            <span>•</span>
            <span>🔒 100% Secure Checkout</span>
            <span>•</span>
            <span>✅ Verified Sellers Only</span>
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
                  <div className="h-cat-icon">{cat.icon}</div>
                  <strong>{cat.name}</strong>
                  <span>{cat.desc}</span>
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
                <h2>The <span>MarketPulse</span> Difference</h2>
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
                <h3>Buyer Protection</h3>
                <p>Shop with confidence. Your money is safe until you confirm your order.</p>
              </div>
              <div className="h-why-card">
                <div className="h-why-icon">💰</div>
                <h3>Best Prices</h3>
                <p>We work directly with sellers to bring you the most competitive prices in Kenya.</p>
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
              <h2>Ready to start shopping?</h2>
              <p>Thousands of products, unbeatable prices, fast delivery across Kenya.</p>
              <button onClick={() => navigate("/products")}>Browse All Products →</button>
            </div>
            <div className="h-cta-cards">
              <div className="h-cta-card">
                <span>📱</span>
                <strong>Electronics</strong>
              </div>
              <div className="h-cta-card">
                <span>👗</span>
                <strong>Fashion</strong>
              </div>
              <div className="h-cta-card">
                <span>🏠</span>
                <strong>Home</strong>
              </div>
              <div className="h-cta-card">
                <span>⚽</span>
                <strong>Sports</strong>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

export default Home;