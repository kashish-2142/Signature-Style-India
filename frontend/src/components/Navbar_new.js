// Navigation bar component with modern design
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../../public/logoSig.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <img src={logo} />
          <Link to="/" className="navbar-brand">
            Signature Style India
          </Link>

          {/* Navigation links */}
          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products/Men">Men</Link>
            </li>
            <li>
              <Link to="/products/Women">Women</Link>
            </li>
            <li>
              <Link to="/products/Kids">Kids</Link>
            </li>

            {/* Cart icon with item count */}
            <li>
              <Link to="/cart" className="cart-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.1 16.4H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="cart-count">{totalItems}</span>
                )}
              </Link>
            </li>

            {/* Conditional rendering based on user authentication */}
            {user ? (
              <>
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
                {user.isAdmin && (
                  <li>
                    <Link to="/admin">Admin</Link>
                  </li>
                )}
                <li>
                  <span
                    style={{ color: "var(--neutral-600)", fontSize: "0.9rem" }}
                  >
                    Hello, {user.name}
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="btn btn-secondary btn-sm">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
