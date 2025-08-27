// Checkout page component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../services/api";

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in or cart is empty
  if (!user) {
    navigate("/login");
    return null;
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // Handle input changes
  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          size: item.size,
        })),
        shippingAddress,
      };

      // Create order
      const response = await orderAPI.createOrder(orderData);

      // Clear cart and redirect to success page
      clearCart();
      toast.success(
        "Order placed successfully! Order ID: " + response.data.order._id
      );
      navigate("/orders");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Checkout</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Shipping form */}
        <div>
          <h2>Shipping Information</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={shippingAddress.street}
                onChange={handleChange}
                required
                placeholder="123 Main Street"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                  placeholder="New Delhi"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  required
                  placeholder="Delhi"
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="10001"
                />
              </div>

              {/* <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  required
                >
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
              </div> */}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <h2>Order Summary</h2>
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Order items */}
            {items.map((item) => (
              <div
                key={`${item.product._id}-${item.size}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #ecf0f1",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.product.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                    Size: {item.size} | Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: "bold" }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            {/* Order total */}
            <div
              style={{
                borderTop: "2px solid #2c3e50",
                paddingTop: "1rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping info */}
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#ecf0f1",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              <div>
                <strong>Shipping:</strong> Free (5-7 business days)
              </div>
              <div>
                <strong>Payment:</strong> Cash on Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
