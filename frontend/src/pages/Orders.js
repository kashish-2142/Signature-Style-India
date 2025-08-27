// Orders page showing user's order history
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../services/api";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  // Fetch user's orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getOrders();
        setOrders(response.data);
        setError("");
      } catch (err) {
        setError("Failed to load orders. Please try again.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "confirmed":
        return "#3498db";
      case "shipped":
        return "#9b59b6";
      case "delivered":
        return "#27ae60";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#7f8c8d";
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Order header */}
              <div
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
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      backgroundColor: getStatusColor(order.status),
                      color: "white",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {order.status}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                    }}
                  >
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div>
                <h4 style={{ marginBottom: "1rem" }}>Items:</h4>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.product && (
                      <>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/50x50/3498db/ffffff?text=${item.product.name}`;
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "bold" }}>
                            {item.product.name}
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                            Size: {item.size} | Quantity: {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontWeight: "bold" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                  }}
                >
                  <h4 style={{ marginBottom: "0.5rem" }}>Shipping Address:</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
