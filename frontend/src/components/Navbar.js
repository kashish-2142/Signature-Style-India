// Modern Navigation bar component with enhanced styling
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  // Check if current path is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-container">
          {/* Logo/Brand name with your custom logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-container">
              <div className="brand-logo">
                {/* Your Custom Signature Style India Logo */}
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* India Map Shape in Tricolor */}
                  <g transform="translate(50, 30)">
                    {/* India outline - approximate shape */}
                    <path
                      d="M50 10 C45 5, 40 8, 35 12 L30 20 C25 25, 20 30, 18 40 L15 50 C12 60, 15 70, 20 80 L25 90 C30 100, 35 105, 45 110 L55 115 C65 118, 75 115, 85 110 L95 105 C100 100, 102 90, 100 80 L98 70 C95 60, 90 50, 85 40 L80 30 C75 20, 70 15, 65 12 L60 8 C58 6, 54 8, 50 10 Z"
                      fill="url(#indiaGradient)"
                      stroke="#fff"
                      strokeWidth="1"
                    />

                    {/* Star/decorative element at center */}
                    <circle cx="60" cy="60" r="8" fill="#fff" opacity="0.9" />
                    <path
                      d="M60 52 L62 58 L68 58 L63 62 L65 68 L60 64 L55 68 L57 62 L52 58 L58 58 Z"
                      fill="#ff6b35"
                    />
                  </g>

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient
                      id="indiaGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ff9933" /> {/* Saffron */}
                      <stop offset="50%" stopColor="#ffffff" /> {/* White */}
                      <stop offset="100%" stopColor="#138808" /> {/* Green */}
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="brand-text">
                <span className="brand-name">SIGNATURE</span>
                <span className="brand-subtitle">STYLE INDIA</span>
              </div>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Navigation links */}
          <ul
            className={`navbar-links ${isMobileMenuOpen ? "mobile-open" : ""}`}
          >
            <li>
              <Link
                to="/"
                className={isActive("/") ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/products/Men"
                className={isActive("/products/Men") ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Men</span>
              </Link>
            </li>
            <li>
              <Link
                to="/products/Women"
                className={isActive("/products/Women") ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Women</span>
              </Link>
            </li>
            <li>
              <Link
                to="/products/Kids"
                className={isActive("/products/Kids") ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Kids</span>
              </Link>
            </li>

            {/* Cart icon with enhanced styling */}
            <li>
              <Link
                to="/cart"
                className={`cart-icon ${isActive("/cart") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="cart-container">
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
                  <span className="cart-text">Cart</span>
                  {totalItems > 0 && (
                    <span className="cart-count">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </li>

            {/* Conditional rendering based on user authentication */}
            {user ? (
              <>
                <li>
                  <Link
                    to="/orders"
                    className={isActive("/orders") ? "active" : ""}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">📦</span>
                    <span>Orders</span>
                  </Link>
                </li>
                {user.isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className={`admin-link ${
                        isActive("/admin") ? "active" : ""
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="nav-icon">⚙️</span>
                      <span>Admin</span>
                    </Link>
                  </li>
                )}
                <li className="user-info">
                  <div className="user-avatar">
                    <div className="avatar-circle">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">Hi, {user.name}</span>
                  </div>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline logout-btn"
                  >
                    <span className="nav-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`btn btn-outline ${
                      isActive("/login") ? "active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">🔑</span>
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className={`btn btn-primary ${
                      isActive("/signup") ? "active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">✨</span>
                    <span>Sign Up</span>
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
