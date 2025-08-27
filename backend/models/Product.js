// Product model for storing denim jeans information
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids"], // Only these three categories allowed
    },
    sizes: [
      {
        type: String,
        enum: [
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
        ],
      },
    ],
    image: {
      type: String,
      required: true, // URL of the product image
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Product", productSchema);
