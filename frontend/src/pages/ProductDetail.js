// Product detail page showing individual product information
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { productAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProduct(id);
        setProduct(response.data);
        // Set first available size as default
        if (response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        setError(null);
      } catch (err) {
        setError("Product not found or failed to load.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setAddingToCart(true);

    // Add product to cart
    addToCart(product, selectedSize, quantity);

    // Show success message
    toast.success(`Added ${quantity} ${product.name} (Size: ${selectedSize}) to cart!`);

    setAddingToCart(false);
  };

  // Handle buy now (redirect to cart)
  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // Add to cart and redirect to cart page
    addToCart(product, selectedSize, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-detail">
        {/* Product image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/500x500/3498db/ffffff?text=${product.name}`;
            }}
          />
        </div>

        {/* Product information */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <div
            className="product-price"
            style={{ fontSize: "2rem", margin: "1rem 0" }}
          >
            ₹{product.price}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Size selector */}
          <div className="size-selector">
            <h3>Size</h3>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-option ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div style={{ margin: "1rem 0" }}>
            <h3>Quantity</h3>
            <div className="quantity-controls" style={{ marginTop: "0.5rem" }}>
              <button
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span style={{ padding: "0 1rem", fontSize: "1.2rem" }}>
                {quantity}
              </span>
              <button
                className="quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock status */}
          <div
            style={{
              margin: "1rem 0",
              color: product.stock > 0 ? "#27ae60" : "#e74c3c",
            }}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          {/* Category and additional info */}
          <div
            style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#7f8c8d" }}
          >
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Available Sizes:</strong> {product.sizes.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
