// Order routes for managing customer orders
const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { auth } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders - Create new order
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    // Process each item in the order
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      // Check if requested size is available
      if (!product.sizes.includes(item.size)) {
        return res.status(400).json({
          message: `Size ${item.size} not available for ${product.name}`,
        });
      }

      // Check if there's enough stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        price: product.price,
      });
    }

    // Create new order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    await order.save();

    // Update stock for each product after successful order creation
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    // Populate product details in response
    await order.populate("items.product", "name image");

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/orders - Get user's orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/orders/:id - Get specific order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status (for future use)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    // Get the current order to check previous status
    const currentOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If order is being cancelled, restore stock
    if (status === "cancelled" && currentOrder.status !== "cancelled") {
      for (let orderItem of currentOrder.items) {
        await Product.findByIdAndUpdate(
          orderItem.product,
          { $inc: { stock: orderItem.quantity } },
          { new: true }
        );
      }
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    ).populate("items.product", "name image");

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/orders/:id - Cancel order and restore stock
router.delete("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation if order is pending
    if (order.status !== "pending") {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Restore stock for each item
    for (let orderItem of order.items) {
      await Product.findByIdAndUpdate(
        orderItem.product,
        { $inc: { stock: orderItem.quantity } },
        { new: true }
      );
    }

    // Mark order as cancelled instead of deleting
    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully and stock restored",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
