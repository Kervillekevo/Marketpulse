import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./ProductDetails.css";
import Footer from "../components/Footer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, setCartCount } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/Products/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImage(
          data.images?.length > 0 && data.images[0].image
            ? data.images[0].image
            : "/placeholder.png"
        );
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please sign in to add items to cart.");
      return;
    }
    try {
      setAdding(true);
      const response = await fetch(`${BASE_URL}/orders/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      setCartCount((prev) => prev + 1);
      alert("Added to cart successfully 🛒");
    } catch {
      alert("Something went wrong.");
    } finally {
      setAdding(false);
    }
  };

  // WhatsApp Order Integration
  const handleWhatsAppOrder = () => {
    if (!product) return;

    const phoneNumber = "254742800420"; 

    const message = `
Hello, I would like to order:

🛍 Product: ${product.title}
💰 Price: Ksh ${Number(product.price).toLocaleString()}
🔗 Product Link: ${window.location.href}

Please confirm availability. Thank you.
`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star">
        {i < rounded ? "★" : "☆"}
      </span>
    ));
  };

  if (error) return <p className="loading">{error}</p>;
  if (!product) return <p className="loading">Loading product...</p>;

  const price = Number(product.price) || 0;
  const oldPrice = Number(product.old_price) || null;
  const discount = product.discount_percentage || 0;

  return (
    <>
      <div className="product-page">
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>Home</span>
          <span className="sep">›</span>
          <span onClick={() => navigate("/products")}>Products</span>
          {product.category && (
            <>
              <span className="sep">›</span>
              <span onClick={() => navigate("/products")}>
                {product.category}
              </span>
            </>
          )}
          <span className="sep">›</span>
          <span className="current">{product.title}</span>
        </div>

        <div className="details-container">
          <div className="details-image">
            <div className="main-image-wrap">
              <img
                src={selectedImage}
                alt={product.title}
                className="main-image"
              />
              {discount > 0 && (
                <span className="img-discount-badge">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="thumbnail-row">
                {product.images.map((imgObj) =>
                  imgObj.image ? (
                    <img
                      key={imgObj.id}
                      src={imgObj.image}
                      alt="thumbnail"
                      className={`thumbnail ${
                        selectedImage === imgObj.image ? "active-thumb" : ""
                      }`}
                      onClick={() => setSelectedImage(imgObj.image)}
                    />
                  ) : null
                )}
              </div>
            )}
          </div>

          <div className="details-info">
            {product.category && (
              <div className="product-category-tag">
                🏷️ {product.subcategory || product.category}
              </div>
            )}

            <h1 className="product-title">{product.title}</h1>

            <div className="rating-section">
              <div className="stars-wrap">
                {renderStars(product.rating)}
              </div>
              <span className="rating-value">
                {product.rating ?? "—"} / 5
              </span>
              <span className="rating-count">
                · {product.review_count ?? 0} reviews
              </span>
            </div>

            <div className="price-section">
              <span className="new-price">
                Ksh {price.toLocaleString()}
              </span>
              {oldPrice && discount > 0 && (
                <>
                  <span className="old-price">
                    Ksh {oldPrice.toLocaleString()}
                  </span>
                  <span className="discount-badge">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="divider" />

            <div className="description-box">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="delivery-info">
              <div className="delivery-chip">
                <span className="chip-icon">🚚</span> Same-day delivery in Nairobi
              </div>
              <div className="delivery-chip">
                <span className="chip-icon">🔄</span> Easy 7-day returns
              </div>
              <div className="delivery-chip">
                <span className="chip-icon">🔒</span> Secure checkout
              </div>
            </div>

            
            <div className="action-row">
              <button
                className="buy-btn"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? "Adding to cart..." : "🛒 Add to Cart"}
              </button>

              <button
                className="whatsapp-btn"
                onClick={handleWhatsAppOrder}
              >
                📲 Order via WhatsApp
              </button>

              <button
                className="wishlist-btn"
                title={
                  wishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                onClick={() => setWishlisted((w) => !w)}
              >
                {wishlisted ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;