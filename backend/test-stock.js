const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

async function testStockManagement() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find a product to test with
    const product = await Product.findOne({});
    if (!product) {
      console.log("No products found");
      return;
    }

    console.log(`Testing stock management with product: ${product.name}`);
    console.log(`Current stock: ${product.stock}`);

    // Simulate order creation - decrement stock
    const orderQuantity = 2;
    console.log(`Simulating order for ${orderQuantity} items...`);

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      { $inc: { stock: -orderQuantity } },
      { new: true }
    );

    console.log(`Stock after order: ${updatedProduct.stock}`);

    // Simulate order cancellation - restore stock
    console.log(`Simulating order cancellation...`);

    const restoredProduct = await Product.findByIdAndUpdate(
      product._id,
      { $inc: { stock: orderQuantity } },
      { new: true }
    );

    console.log(`Stock after cancellation: ${restoredProduct.stock}`);
    console.log("✅ Stock management test completed successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

testStockManagement();
