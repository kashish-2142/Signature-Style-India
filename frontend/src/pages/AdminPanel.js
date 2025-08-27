// Admin panel for managing products
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { productAPI } from "../services/api";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingStock, setEditingStock] = useState(null);
  const [updatedStock, setUpdatedStock] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [updatedImage, setUpdatedImage] = useState("");

  // New product form data
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    sizes: [],
    image: "",
    stock: "",
  });

  // Available sizes
  const availableSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
  ];

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Redirect if not admin (moved after hooks)
  if (!user || !user.isAdmin) {
    navigate("/");
    return null;
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      setProducts(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load products.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    const updatedSizes = newProduct.sizes.includes(size)
      ? newProduct.sizes.filter((s) => s !== size)
      : [...newProduct.sizes, size];

    setNewProduct({
      ...newProduct,
      sizes: updatedSizes,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form
      if (newProduct.sizes.length === 0) {
        toast.error("Please select at least one size");
        return;
      }

      // Prepare product data
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      };

      await productAPI.addProduct(productData);

      toast.success("Product added successfully!");
      setShowAddForm(false);

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "Men",
        sizes: [],
        image: "",
        stock: "",
      });

      // Refresh products list
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
      setSuccess("");
    }
  };

  // Handle product deletion
  const handleDelete = async (productId, productName) => {
    toast(
      (t) => (
        <div style={{ textAlign: "center" }}>
          <p>Are you sure you want to delete "{productName}"?</p>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(productId, productName);
              }}
            >
              Delete
            </button>
            <button
              style={{
                background: "#6b7280",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  // Confirm product deletion
  const confirmDelete = async (productId, productName) => {
    try {
      await productAPI.deleteProduct(productId);
      toast.success("Product deleted successfully!");
      setError("");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
      setSuccess("");
    }
  };

  // Handle stock update
  const handleStockUpdate = async (productId) => {
    try {
      const newStock = parseInt(updatedStock);
      if (isNaN(newStock) || newStock < 0) {
        setError("Please enter a valid stock number");
        return;
      }

      await productAPI.updateProduct(productId, { stock: newStock });

      // Update local state
      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, stock: newStock } : product
        )
      );

      setEditingStock(null);
      setUpdatedStock("");
      setSuccess("Stock updated successfully!");
      setError("");
    } catch (err) {
      setError(
        "Failed to update stock: " +
          (err.response?.data?.message || err.message)
      );
      setSuccess("");
    }
  };

  return (
    <div className="container">
      <h1>Admin Panel</h1>

      {/* Success/Error messages */}
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Add product button */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? "Cancel" : "Add New Product"}
        </button>
      </div>

      {/* Add product form */}
      {showAddForm && (
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Classic Straight Jeans"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
                placeholder="Describe the product features and benefits"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="99.99"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={newProduct.image}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Available Sizes (select multiple):</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size)}
                    style={{
                      padding: "0.5rem",
                      border: `2px solid ${
                        newProduct.sizes.includes(size) ? "#3498db" : "#bdc3c7"
                      }`,
                      backgroundColor: newProduct.sizes.includes(size)
                        ? "#3498db"
                        : "white",
                      color: newProduct.sizes.includes(size) ? "white" : "#333",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Products list */}
      <div>
        <h2>Existing Products ({products.length})</h2>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    cursor: "pointer",
                    border:
                      editingImage === product._id
                        ? "2px solid #3498db"
                        : undefined,
                  }}
                  onClick={() => {
                    setEditingImage(product._id);
                    setUpdatedImage(product.image);
                  }}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/250x250/3498db/ffffff?text=${product.name}`;
                  }}
                  title="Click to edit image URL"
                />
                {editingImage === product._id && (
                  <div style={{ margin: "0.5rem 0" }}>
                    <input
                      type="text"
                      value={updatedImage}
                      onChange={(e) => setUpdatedImage(e.target.value)}
                      style={{
                        width: "80%",
                        padding: "0.3rem",
                        fontSize: "0.9rem",
                      }}
                    />
                    <button
                      style={{
                        marginLeft: 8,
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        padding: "0.2rem 0.6rem",
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        try {
                          await productAPI.updateProduct(product._id, {
                            image: updatedImage,
                          });
                          toast.success("Image updated!");
                          setEditingImage(null);
                          fetchProducts();
                        } catch (err) {
                          toast.error("Failed to update image");
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      style={{
                        marginLeft: 4,
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        padding: "0.2rem 0.6rem",
                        cursor: "pointer",
                      }}
                      onClick={() => setEditingImage(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div className="product-card-content">
                  <h3>{product.name}</h3>
                  <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                    {product.description.length > 100
                      ? product.description.substring(0, 100) + "..."
                      : product.description}
                  </p>
                  <div className="product-price">₹{product.price}</div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#7f8c8d",
                      marginBottom: "1rem",
                    }}
                  >
                    Category: {product.category} | Stock:
                    {editingStock === product._id ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginLeft: "0.5rem",
                        }}
                      >
                        <input
                          type="number"
                          value={updatedStock}
                          onChange={(e) => setUpdatedStock(e.target.value)}
                          style={{
                            width: "60px",
                            padding: "0.2rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                          }}
                          min="0"
                          placeholder={product.stock}
                        />
                        <button
                          onClick={() => handleStockUpdate(product._id)}
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "0.2rem 0.4rem",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setEditingStock(null);
                            setUpdatedStock("");
                          }}
                          style={{
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            padding: "0.2rem 0.4rem",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          color:
                            product.stock > 10
                              ? "#28a745"
                              : product.stock > 0
                              ? "#ffc107"
                              : "#dc3545",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setEditingStock(product._id);
                          setUpdatedStock(product.stock.toString());
                        }}
                        title="Click to edit stock"
                      >
                        {product.stock}
                        {product.stock === 0 && " (Out)"}
                        {product.stock > 0 && product.stock <= 10 && " (Low)"}
                        <span
                          style={{ fontSize: "0.6rem", marginLeft: "0.3rem" }}
                        >
                          ✏️
                        </span>
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#7f8c8d",
                      marginBottom: "1rem",
                    }}
                  >
                    Sizes: {product.sizes.join(", ")}
                  </div>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    className="btn btn-danger"
                    style={{ width: "100%" }}
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
