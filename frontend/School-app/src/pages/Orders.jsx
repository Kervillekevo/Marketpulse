import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import Footer from "../components/Footer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [shipmentModal, setShipmentModal] = useState(null);
  const [shipmentData, setShipmentData] = useState(null);
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [payPhone, setPayPhone] = useState("");

  const [shipmentForm, setShipmentForm] = useState({
    name: "", email: "", phone_number: "",
    county: "", town: "", street_address: "",
    delivery_instructions: "", shipping_method: "standard",
  });

  const { token } = useContext(AuthContext);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${BASE_URL}/orders/orders/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetchOrders();
  }, [token]);

  const fetchShipment = async (orderId) => {
    setShipmentLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/orders/orders/${orderId}/shipment/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setShipmentData(data);
    } catch {
      setShipmentData(null);
    } finally {
      setShipmentLoading(false);
    }
  };

  const handleToggleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      setShipmentData(null);
    } else {
      setExpandedOrder(orderId);
      const order = orders.find((o) => o.id === orderId);
      if (order?.shipment) fetchShipment(orderId);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const res = await fetch(`${BASE_URL}/orders/orders/${orderId}/cancel/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error();
      fetchOrders();
    } catch {
      alert("Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleShipmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/orders/orders/${shipmentModal}/shipment/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(shipmentForm),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + JSON.stringify(err));
        return;
      }
      setShipmentModal(null);
      setShipmentForm({
        name: "", email: "", phone_number: "",
        county: "", town: "", street_address: "",
        delivery_instructions: "", shipping_method: "standard",
      });
      fetchOrders();
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleMpesaPayment = async () => {
    if (!payPhone.trim()) return;
    const orderId = payModal;
    setPayingId(orderId);
    try {
      const res = await fetch(`${BASE_URL}/orders/mpesa/pay/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ phone: payPhone, order_id: orderId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Payment failed: " + JSON.stringify(data));
        return;
      }
      setPayModal(null);
      setPayPhone("");
      alert("STK Push sent. Complete payment on your phone.");

      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const r = await fetch(`${BASE_URL}/orders/orders/`, {
            headers: { Authorization: `Token ${token}` },
          });
          const updated = await r.json();
          setOrders(updated);
          const targetOrder = updated.find((o) => o.id === orderId);
          if (targetOrder?.status === "paid" || attempts >= 6) {
            clearInterval(poll);
          }
        } catch {
          clearInterval(poll);
        }
      }, 5000);

    } catch (err) {
      alert("Payment error: " + err.message);
    } finally {
      setPayingId(null);
    }
  };

  const statusIcon = (s) =>
    ({ pending: "⏳", paid: "💰", processing: "⚙️", completed: "✅", shipped: "🚚", cancelled: "❌" }[s] || "📦");

  if (loading) {
    return (
      <>
        <div className="orders-loading">
          <div className="loading-spinner" />
          Loading your orders...
        </div>
        <Footer />
      </>
    );
  }

  if (!token) {
    return (
      <>
        <div className="orders-empty-wrap">
          <div className="orders-empty">
            <h2>Sign in to view orders</h2>
            <p>You need to be signed in to see your order history.</p>
            <button className="orders-empty-btn" onClick={() => navigate("/")}>Sign In</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <div className="orders-empty-wrap">
          <div className="orders-empty">
            <h2>No orders yet</h2>
            <p>You haven't placed any orders. Start shopping and your orders will appear here.</p>
            <button className="orders-empty-btn" onClick={() => navigate("/")}>Start Shopping</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="orders-page">
        <div className="orders-inner">

          <div className="orders-header">
            <h1>My <span>Orders</span></h1>
            <span className="orders-count-badge">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">

                <div className={`order-card-bar ${order.status}`} />

                <div className="order-card-body">

                  <div className="order-header">
                    <div className="order-header-left">
                      <h4>Order #{order.id}</h4>
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>
                    <div className="order-header-right">
                      <span className={`status-badge ${order.status}`}>
                        {statusIcon(order.status)} {order.status}
                      </span>
                      <button className="expand-btn" onClick={() => handleToggleExpand(order.id)}>
                        {expandedOrder === order.id ? "▲ Less" : "▼ Details"}
                      </button>
                    </div>
                  </div>

                  <div className="order-divider" />

                  <div className="order-items-preview">
                    {(expandedOrder === order.id ? order.items : order.items?.slice(0, 2))?.map((item) => (
                      <div className="order-item" key={item.id}>
                        <div className="order-item-img">
                          <img
                            src={item.product?.images?.length > 0 ? item.product.images[0].image : "/placeholder.png"}
                            alt={item.product?.title || "Product"}
                          />
                        </div>
                        <div className="order-item-info">
                          <div className="item-title">{item.product?.title || "Product"}</div>
                          <div className="item-meta">
                            <span className="item-qty">Qty: {item.quantity}</span>
                            <span className="item-price-tag">Ksh {Number(item.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {expandedOrder !== order.id && order.items?.length > 2 && (
                      <div className="more-items-hint">+{order.items.length - 2} more item{order.items.length - 2 !== 1 ? "s" : ""}</div>
                    )}
                  </div>


                  {expandedOrder === order.id && (
                    <div className="order-expanded">
                      <div className="shipment-section">
                        <div className="expanded-section-label">Shipment Details</div>
                        {shipmentLoading ? (
                          <div className="shipment-loading">Loading shipment info...</div>
                        ) : shipmentData ? (
                          <div className="shipment-grid">
                            {shipmentData.tracking_number && (
                              <div className="shipment-row">
                                <span className="shipment-key">Tracking No.</span>
                                <span className="shipment-val"><span className="tracking-num">{shipmentData.tracking_number}</span></span>
                              </div>
                            )}
                            <div className="shipment-row">
                              <span className="shipment-key">Recipient</span>
                              <span className="shipment-val">{shipmentData.name}</span>
                            </div>
                            <div className="shipment-row">
                              <span className="shipment-key">Phone</span>
                              <span className="shipment-val">{shipmentData.phone_number}</span>
                            </div>
                            <div className="shipment-row full-row">
                              <span className="shipment-key">Address</span>
                              <span className="shipment-val">{shipmentData.street_address}, {shipmentData.town}, {shipmentData.county}</span>
                            </div>
                            <div className="shipment-row">
                              <span className="shipment-key">Method</span>
                              <span className="shipment-val"><span className="method-chip">{shipmentData.shipping_method}</span></span>
                            </div>
                            {shipmentData.estimated_delivery_date && (
                              <div className="shipment-row">
                                <span className="shipment-key">Est. Delivery</span>
                                <span className="shipment-val">
                                  {new Date(shipmentData.estimated_delivery_date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                                </span>
                              </div>
                            )}
                            {shipmentData.shipping_fee && (
                              <div className="shipment-row">
                                <span className="shipment-key">Shipping Fee</span>
                                <span className="shipment-val">Ksh {Number(shipmentData.shipping_fee).toLocaleString()}</span>
                              </div>
                            )}
                            {shipmentData.delivery_instructions && (
                              <div className="shipment-row full-row">
                                <span className="shipment-key">Instructions</span>
                                <span className="shipment-val">{shipmentData.delivery_instructions}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="no-shipment-note">No shipment info added yet.</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="order-footer">
                    <div className="order-total-wrap">
                      <span className="order-total-label">Order Total</span>
                      <span className="order-total-amount">
                        Ksh <span>{Number(order.total_amount).toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="order-actions">
                      {order.status === "shipped" && (
                        <button className="btn-track" onClick={() => handleToggleExpand(order.id)}>
                          🚚 Track Order
                        </button>
                      )}
                      {order.status === "pending" && !order.shipment && (
                        <button className="btn-ship" onClick={() => setShipmentModal(order.id)}>
                          Add Delivery Details
                        </button>
                      )}
                      {order.status === "pending" && order.shipment && (
                        <button className="btn-pay" onClick={() => { setPayModal(order.id); setPayPhone(""); }} disabled={payingId === order.id}>
                          Pay Now
                        </button>
                      )}
                      {!["shipped", "completed", "cancelled"].includes(order.status) && (
                        <button className="btn-cancel" onClick={() => handleCancelOrder(order.id)} disabled={cancellingId === order.id}>
                          {cancellingId === order.id ? "Cancelling..." : "✕ Cancel"}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {payModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setPayModal(null)}>
          <div className="pay-modal">
            <div className="pay-modal-icon">📱</div>
            <h2>M-Pesa Payment</h2>
            <p>Enter your Safaricom number to receive the STK push prompt.</p>
            <div className="pay-phone-wrap">
              <span className="pay-phone-prefix">+254</span>
              <input
                className="pay-phone-input"
                type="tel"
                placeholder="712 345 678"
                value={payPhone}
                onChange={(e) => setPayPhone(e.target.value)}
                maxLength={12}
              />
            </div>
            <div className="pay-hint">Format: 254712345678</div>
            <div className="pay-modal-actions">
              <button className="btn-cancel-form" onClick={() => setPayModal(null)}>Cancel</button>
              <button className="btn-submit-ship" onClick={handleMpesaPayment} disabled={payingId === payModal || !payPhone.trim()}>
                {payingId === payModal ? "Processing..." : "Send STK Push"}
              </button>
            </div>
          </div>
        </div>
      )}

      {shipmentModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShipmentModal(null)}>
          <div className="shipment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shipment-modal-header">
              <div>
                <h2>Delivery Details</h2>
                <p>Order #{shipmentModal} — fill in where to deliver</p>
              </div>
              <button className="modal-x-btn" onClick={() => setShipmentModal(null)}>✕</button>
            </div>
            <form className="shipment-form" onSubmit={handleShipmentSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input required placeholder="John Doe" value={shipmentForm.name} onChange={(e) => setShipmentForm({ ...shipmentForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input required placeholder="0712 345 678" value={shipmentForm.phone_number} onChange={(e) => setShipmentForm({ ...shipmentForm, phone_number: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Email (optional)</label>
                <input type="email" placeholder="john@example.com" value={shipmentForm.email} onChange={(e) => setShipmentForm({ ...shipmentForm, email: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>County</label>
                  <input required placeholder="e.g. Nairobi" value={shipmentForm.county} onChange={(e) => setShipmentForm({ ...shipmentForm, county: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Town</label>
                  <input required placeholder="e.g. Westlands" value={shipmentForm.town} onChange={(e) => setShipmentForm({ ...shipmentForm, town: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input required placeholder="e.g. Moi Avenue, Building Name" value={shipmentForm.street_address} onChange={(e) => setShipmentForm({ ...shipmentForm, street_address: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Delivery Instructions (optional)</label>
                <textarea rows={3} placeholder="e.g. Leave at the gate, call on arrival..." value={shipmentForm.delivery_instructions} onChange={(e) => setShipmentForm({ ...shipmentForm, delivery_instructions: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Shipping Method</label>
                <div className="shipping-method-options">
                  {[
                    { value: "pickup",    name: "Store Pickup",      desc: "Today · Free" },
                  ].map((m) => (
                    <label key={m.value} className={`method-option ${shipmentForm.shipping_method === m.value ? "selected" : ""}`}>
                      <input type="radio" name="shipping_method" value={m.value} checked={shipmentForm.shipping_method === m.value} onChange={(e) => setShipmentForm({ ...shipmentForm, shipping_method: e.target.value })} />
                      <span className="method-icon">{m.icon}</span>
                      <span className="method-text">
                        <span className="method-name">{m.name}</span>
                        <span className="method-desc">{m.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="shipment-form-actions">
                <button type="button" className="btn-cancel-form" onClick={() => setShipmentModal(null)}>Cancel</button>
                <button type="submit" className="btn-submit-ship">Save Delivery Details →</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Orders;