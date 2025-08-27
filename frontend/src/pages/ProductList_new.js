// Modern Product list page with beautiful design
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
      <div className="main-content">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading premium denim collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="error-message">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary mt-8"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        {/* Page header with beautiful gradient background */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--primary-600), var(--accent-indigo))",
            color: "white",
            padding: "var(--space-16) var(--space-8)",
            borderRadius: "var(--radius-2xl)",
            textAlign: "center",
            marginBottom: "var(--space-12)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "3rem",
              marginBottom: "var(--space-4)",
            }}
          >
            {isFitFilter ? `${category} Collection` : `${category}'s Denim`}
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "var(--space-6)",
            }}
          >
            {products.length} premium{" "}
            {products.length !== 1 ? "pieces" : "piece"}
            {isFitFilter && " across all categories"}
          </p>

          {/* Filter badges */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              {isFitFilter ? "All Genders" : category}
            </span>
            {isFitFilter && (
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                {category} Style
              </span>
            )}
          </div>
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-20)",
              background: "white",
              borderRadius: "var(--radius-2xl)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "var(--space-8)" }}>
              👖
            </div>
            <h3
              style={{
                marginBottom: "var(--space-4)",
                color: "var(--neutral-800)",
              }}
            >
              No products found in this {isFitFilter ? "fit style" : "category"}
            </h3>
            <p
              style={{
                color: "var(--neutral-600)",
                marginBottom: "var(--space-8)",
              }}
            >
              We're constantly updating our collection. Check back soon for new
              arrivals!
            </p>
            <Link to="/" className="btn btn-primary">
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className="fade-in-up"
              >
                <div className="product-card">
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = `https://via.placeholder.com/300x320/3498db/ffffff?text=${encodeURIComponent(
                          product.name
                        )}`;
                      }}
                    />
                    {/* Category badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-3)",
                        left: "var(--space-3)",
                        background: "var(--primary-600)",
                        color: "white",
                        padding: "var(--space-1) var(--space-3)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      {product.category}
                    </div>
                  </div>

                  <div className="product-card-content">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    <div className="product-price">${product.price}</div>

                    <div className="product-meta">
                      <div style={{ marginBottom: "var(--space-2)" }}>
                        <strong>Sizes:</strong> {product.sizes.join(", ")}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)",
                          fontSize: "0.8rem",
                          color: "var(--neutral-500)",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background:
                              product.stock > 10
                                ? "var(--accent-emerald)"
                                : product.stock > 0
                                ? "var(--accent-orange)"
                                : "var(--accent-rose)",
                          }}
                        ></span>
                        {product.stock > 10
                          ? "In Stock"
                          : product.stock > 0
                          ? "Limited Stock"
                          : "Out of Stock"}
                      </div>
                    </div>

                    <button className="btn btn-primary w-full">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to categories link */}
        <div style={{ textAlign: "center", margin: "var(--space-16) 0" }}>
          <Link to="/" className="btn btn-secondary">
            ← Back to All Categories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
