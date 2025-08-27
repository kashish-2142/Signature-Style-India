// Modern Homepage component with beautiful design
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Category data with fit-based categories
  const categories = [
    {
      name: "Slim Fit",
      image:
        "https://freakins.com/cdn/shop/files/PAL09686-Edit_e122bb5e-1352-4925-bc91-f8d92be52680.jpg?v=1749907658",
      description: "Modern slim-fit jeans for a sleek, tailored look",
    },
    {
      name: "Straight Fit",
      image:
        "https://freakins.com/cdn/shop/files/8-JULY24_17163-Edit.jpg?v=1749906581",
      description: "Classic straight-fit jeans for timeless style",
    },
    {
      name: "Regular Fit",
      image:
        "https://www.beyoung.in/api/cache/catalog/products/men_new_jeans/soft_blue_regular_fit_mens_jeans_base_28_05_2024_700x933.jpg",
      description: "Comfortable regular-fit jeans for everyday wear",
    },
    {
      name: "Skinny Fit",
      image:
        "https://www.jiomart.com/images/product/original/441132366_ltblue/lightly-washed-core-skinny-fit-jeans-model-441132366_ltblue-0-202202170936.jpg?im=Resize=(500,630)",
      description: "Ultra-slim skinny fit for a modern silhouette",
    },
    {
      name: "Bootcut",
      image:
        "https://offduty.in/cdn/shop/files/retrowashflarejeans_1080x.webp?v=1713875833",
      description: "Classic bootcut jeans perfect for pairing with boots",
    },
    {
      name: "Relaxed Fit",
      image:
        "https://lsco.scene7.com/is/image/lsco/A72210010-front-pdp-ld?fmt=webp&qlt=80&resMode=sharp2&fit=crop,1&op_usm=1.25,0.6,8&wid=2000&hei=2500",
      description: "Ultimate comfort with relaxed-fit jeans",
    },
  ];

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in-up">
            <h1>Premium Denim Collection</h1>
            <p>
              Discover the perfect fit with our expertly crafted jeans. From
              classic cuts to modern styles, find your signature look in our
              curated collection of premium denim.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link to="/products/Men" className="btn btn-primary btn-lg">
                Shop Men's
              </Link>
              <Link to="/products/Women" className="btn btn-accent btn-lg">
                Shop Women's
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Category Section */}
        <section style={{ margin: "var(--space-20) 0" }}>
          <div className="text-center mb-16">
            <h2>Shop by Fit</h2>
            <p
              style={{
                fontSize: "1.1rem",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Every body is unique, and so is every fit. Explore our range of
              carefully designed fits to find the perfect jeans for your style
              and comfort.
            </p>
          </div>

          {/* Category grid */}
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/products/${category.name}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className="fade-in-up"
              >
                <div className="category-card ">
                  <img
                    src={category.image}
                    alt={`${category.name} jeans`}
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.src = `https://via.placeholder.com/400x300/3498db/ffffff?text=${category.name}+Jeans`;
                    }}
                  />
                  <div className="category-card-content">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <button className="btn btn-primary">
                      Explore {category.name}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features section */}
        <section className="features">
          <div className="text-center mb-16">
            <h2>Why Choose DenimCo?</h2>
            <p
              style={{
                fontSize: "1.1rem",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              We're passionate about creating exceptional denim that combines
              style, comfort, and durability.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>Premium Quality</h3>
              <p>
                Made from the finest denim materials sourced globally, ensuring
                durability and comfort that lasts for years.
              </p>
            </div>
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 6L10 10L6 6V18H18V6H14Z" fill="currentColor" />
                </svg>
              </div>
              <h3>Perfect Fit</h3>
              <p>
                Extensive size range and multiple fit options ensure everyone
                finds their perfect pair, tailored to different body types.
              </p>
            </div>
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 9V3.5L22 12L13 20.5V15C6 15 2 18 2 22C4 16 8 13 13 13V9Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>
                Quick and reliable shipping to your doorstep with tracking, plus
                easy returns and exchanges within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section
          style={{
            textAlign: "center",
            margin: "var(--space-20) 0",
            padding: "var(--space-16) 0",
          }}
        >
          <h2>Ready to Find Your Perfect Fit?</h2>
          <p
            style={{
              fontSize: "1.1rem",
              margin: "var(--space-6) 0",
              color: "var(--neutral-600)",
            }}
          >
            Join thousands of satisfied customers who found their signature
            style with DenimCo.
          </p>
          <Link to="/products/Men" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
