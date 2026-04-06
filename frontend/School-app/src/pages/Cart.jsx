import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./Cart.css";

const BASE_URL = "http://127.0.0.1:8000";

function Cart() {
  const { token, setCartCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    fetch(`${BASE_URL}/orders/cart/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        const totalItems = data?.items
          ? data.items.reduce((sum, item) => sum + item.quantity, 0)
          : 0;
        setCartCount(totalItems);
        setLoading(false);
      })
      .catch(() => {
        setCartCount(0);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetchCart();
  }, [token]);

  const removeItem = (itemId) => {
    fetch(`${BASE_URL}/orders/cart/remove/${itemId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchCart());
  };

  const clearCart = () => {
    fetch(`${BASE_URL}/orders/cart/clear/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchCart());
  };

  const updateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    const difference = newQuantity - item.quantity;

    if (difference > 0) {
      fetch(`${BASE_URL}/orders/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product_id: item.product.id, quantity: difference }),
      }).then(() => fetchCart());
    } else if (difference < 0) {
      fetch(`${BASE_URL}/orders/cart/remove/${item.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      })
        .then(() =>
          fetch(`${BASE_URL}/orders/cart/add/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ product_id: item.product.id, quantity: newQuantity }),
          })
        )
        .then(() => fetchCart());
    }
  };

  const checkout = () => {
    fetch(`${BASE_URL}/orders/order/create/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to place order");
        return res.json();
      })
      .then(() => {
        setCartCount(0);
        navigate("/orders");
      })
      .catch(() => alert("Something went wrong while placing your order."));
  };

  if (loading) {
    return (
      <>
        <div className="cart-loading">Loading your cart...</div>
        <Footer />
      </>
    );
  }

  if (!token) {
    return (
      <>
        <div className="cart-empty-wrap">
          <div className="cart-empty">
            <span className="cart-empty-icon">🔐</span>
            <h2>Sign in to view your cart</h2>
            <p>You need to be signed in to add items and place orders.</p>
            <button className="cart-empty-btn" onClick={() => navigate("/")}>
              Sign In
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <>
        <div className="cart-empty-wrap">
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Start shopping and find something you love!</p>
            <button className="cart-empty-btn" onClick={() => navigate("/")}>
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity, 0
  );
  const delivery = total >= 5000 ? 0 : 200;
  const grandTotal = total + delivery;

  return (
    <>
      <div className="cart-page">
        <div className="cart-page-inner">

          <div className="cart-header">
            <h1>Your <span>Cart</span></h1>
            <span className="cart-item-badge">
              {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="cart-layout">

            <div className="cart-products">
              {items.map((item) => {
                const product = item.product;
                const rating = Math.round(product.rating || 4);

                return (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-image">
                      <img
                        src={
                          product.images?.length > 0
                            ? product.images[0].image
                            : "/placeholder.png"
                        }
                        alt={product.title}
                      />
                    </div>

                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <div>
                          {product.category && (
                            <div className="item-category">{product.subcategory || product.category}</div>
                          )}
                          <h4>{product.title}</h4>
                        </div>
                        <span className="item-price">
                          Ksh {Number(product.price).toLocaleString()}
                        </span>
                      </div>

                      <div className="rating">
                        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                      </div>

                      <div className="cart-item-bottom">
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item, item.quantity - 1)}>−</button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item, parseInt(e.target.value) || 1)
                            }
                          />
                          <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
                        </div>

                        <div className="subtotal">
                          Subtotal: <strong>Ksh {(Number(product.price) * item.quantity).toLocaleString()}</strong>
                        </div>

                        <button className="remove-btn" onClick={() => removeItem(item.id)}>
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="summary-title">Order Summary</div>

              <div className="summary-row">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>Ksh {total.toLocaleString()}</span>
              </div>


              <div className="summary-row total">
                <span>Total</span>
                <span className="total-price">Ksh {grandTotal.toLocaleString()}</span>
              </div>

              <button className="checkout-btn" onClick={checkout}>
                Proceed to Checkout →
              </button>

              <button className="clear-btn" onClick={clearCart}>
                🗑 Clear Cart
              </button>

              <div className="trust-row">
                <div className="trust-item">
                  <span>🔒</span>
                  <span>Secure</span>
                </div>
                <div className="trust-item">
                  <span>🚚</span>
                  <span>Fast Delivery</span>
                </div>
                <div className="trust-item">
                  <span>🔄</span>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Cart;