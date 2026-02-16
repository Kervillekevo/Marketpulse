import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Footer from "../components/Footer";

function Cart() {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders/cart/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error(err));
  }, [token]);

  if (!cart) return <p>Loading cart...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>Your Cart</h2>

      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h4>{item.product.title}</h4>
            <p>Quantity: {item.quantity}</p>
            <p>Price: Ksh {item.product.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;
