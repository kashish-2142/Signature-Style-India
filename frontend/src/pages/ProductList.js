// Product list page showing products for a specific category or fit
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productAPI } from "../services/api";

const ProductList = () => {
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if this is a fit-based filter
  const isFitFilter = [
    "Slim Fit",
    "Straight Fit",
    "Regular Fit",
    "Skinny Fit",
    "Bootcut",
    "Relaxed Fit",
  ].includes(category);

  // Fetch products when component mounts or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        if (isFitFilter) {
          // Filter by fit type across all categories
          response = await productAPI.getProducts("", category);
        } else {
          // Filter by gender category
          response = await productAPI.getProducts(category);
        }

        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, isFitFilter]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
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
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#2c3e50" }}>
          {isFitFilter ? `${category} Jeans` : `${category} Collection`}
        </h1>
        <p style={{ color: "#7f8c8d" }}>
          {products.length} product{products.length !== 1 ? "s" : ""} found
          {isFitFilter && " across all categories"}
        </p>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h3>
            No products found in this {isFitFilter ? "fit type" : "category"}
          </h3>
          <p>Check back soon for new arrivals!</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.src = `https://via.placeholder.com/250x250/3498db/ffffff?text=${product.name}`;
                  }}
                />
                <div className="product-card-content">
                  <h3>{product.name}</h3>
                  <p
                    style={{
                      color: "#7f8c8d",
                      marginBottom: "0.5rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.description}
                  </p>
                  <div className="product-price">₹{product.price}</div>
                  <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                    Category: {product.category} | Sizes:{" "}
                    {product.sizes.join(", ")}
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "1rem", width: "100%" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
