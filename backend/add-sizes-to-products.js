// Script to add sizes to existing products that don't have sizes
const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

async function addSizesToProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find products without sizes or with empty sizes array
    const productsWithoutSizes = await Product.find({
      $or: [
        { sizes: { $exists: false } },
        { sizes: { $size: 0 } },
        { sizes: null }
      ]
    });

    console.log(`Found ${productsWithoutSizes.length} products without sizes`);

    if (productsWithoutSizes.length === 0) {
      console.log("All products already have sizes defined");
      return;
    }

    // Default sizes based on category
    const defaultSizes = {
      "Men": ["28", "30", "32", "34", "36", "38", "40", "42"],
      "Women": ["XS", "S", "M", "L", "XL", "XXL"],
      "Kids": ["XS", "S", "M", "L", "XL"]
    };

    // Update each product with appropriate sizes
    for (const product of productsWithoutSizes) {
      const sizes = defaultSizes[product.category] || ["S", "M", "L"];
      
      await Product.findByIdAndUpdate(product._id, {
        $set: { sizes: sizes }
      });

      console.log(`✅ Updated ${product.name} with sizes: ${sizes.join(", ")}`);
    }

    console.log("🎉 Successfully updated all products with sizes!");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
addSizesToProducts();
