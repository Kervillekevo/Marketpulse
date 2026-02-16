import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import Footer from "../components/Footer";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/Products/${id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="loading">{error}</p>;
  if (!product) return <p className="loading">Loading...</p>;

  return (
    <>
    <div className="page-wrapper">
      <div className="details-container">
        {/* LEFT - PRODUCT IMAGE */}
        <div className="details-image">
          <img
            src={product.images || "/placeholder.png"}
            alt={product.title || "Product"}
          />
        </div>

        {/* RIGHT - PRODUCT INFO */}
        <div className="details-info">
          <h1 className="product-title">{product.title}</h1>

          <p className="product-price">
            Ksh {Number(product.price).toLocaleString()}
          </p>


          <div className="divider"></div>

          <div className="description-box">
      
            <p>{product.description}</p>
          </div>

          <button className="buy-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ProductDetails;
