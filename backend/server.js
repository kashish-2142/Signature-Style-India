// Main server file for the denim store backend
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"], // Allow frontend origins
  credentials: true, // Allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing with specific config
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes); // Authentication routes (login, signup)
app.use("/api/products", productRoutes); // Product routes (get products, add products)
app.use("/api/orders", orderRoutes); // Order routes (create orders, get orders)

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Denim Store API is running!" });
});

// Test route to check users
app.get("/api/test/users", async (req, res) => {
  try {
    const User = require("./models/User");
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.json({
      message: "Users in database",
      count: users.length,
      users: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route to create admin user
app.post("/api/test/create-admin", async (req, res) => {
  try {
    const User = require("./models/User");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@demo.com" });
    if (existingAdmin) {
      return res.json({
        message: "Admin user already exists",
        user: {
          name: existingAdmin.name,
          email: existingAdmin.email,
          isAdmin: existingAdmin.isAdmin,
        },
      });
    }

    const adminUser = new User({
      name: "Admin User",
      email: "admin@demo.com",
      password: "password123",
      isAdmin: true,
    });

    await adminUser.save();
    res.json({
      message: "Admin user created successfully",
      user: {
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
