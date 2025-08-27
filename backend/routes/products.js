// Product routes for managing denim jeans products
const express = require("express");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/products - Get all products (with optional category or fit filter)
router.get("/", async (req, res) => {
  try {
    const { category, fit } = req.query;

    // Build filter object
    const filter = {};
    if (category) {
      filter.category = category;
    }

    // Filter by fit type (search in product name)
    if (fit) {
      filter.name = { $regex: fit, $options: "i" }; // Case-insensitive search for fit in name
    }

    // Get products from database
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/products/:id - Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/products - Add new product (Admin only)
router.post("/", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, sizes, image, stock } =
      req.body;

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      category,
      sizes,
      image,
      stock,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, sizes, image, stock } =
      req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, sizes, image, stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
