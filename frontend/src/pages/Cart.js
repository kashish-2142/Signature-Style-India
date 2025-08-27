// Shopping cart page
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { items, totalItems, totalAmount, updateQuantity, removeFromCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="container">
        <h1>Shopping Cart</h1>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started!</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>
        Shopping Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
      </h1>

      {/* Cart items */}
      <div style={{ marginTop: "2rem" }}>
        {items.map((item) => (
          <div key={`${item.product._id}-${item.size}`} className="cart-item">
            {/* Product image */}
            <img
              src={item.product.image}
              alt={item.product.name}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/80x80/3498db/ffffff?text=${item.product.name}`;
              }}
            />

            {/* Product info */}
            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              <p>Size: {item.size}</p>
              <p className="product-price">₹{item.product.price} each</p>
            </div>

            {/* Quantity controls */}
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() =>
                  updateQuantity(item.product._id, item.size, item.quantity - 1)
                }
              >
                -
              </button>
              <span style={{ padding: "0 1rem", fontSize: "1.1rem" }}>
                {item.quantity}
              </span>
              <button
                className="quantity-btn"
                onClick={() =>
                  updateQuantity(item.product._id, item.size, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            {/* Subtotal and remove button */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeFromCart(item.product._id, item.size)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart summary */}
      <div
        style={{
          marginTop: "2rem",
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Total: ₹{totalAmount.toFixed(2)}</h2>
            <p style={{ color: "#7f8c8d" }}>
              {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <button className="btn btn-primary" onClick={handleCheckout}>
              {user ? "Proceed to Checkout" : "Login to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
