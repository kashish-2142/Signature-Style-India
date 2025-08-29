// Script to check what sizes data exists in current products
const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

async function checkProductSizes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get all products
    const products = await Product.find({});
    console.log(`\n📊 Total products found: ${products.length}\n`);

    // Check each product's sizes
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Sizes: ${JSON.stringify(product.sizes)}`);
      console.log(`   Has sizes field: ${product.sizes ? 'Yes' : 'No'}`);
      console.log(`   Sizes array length: ${product.sizes ? product.sizes.length : 'N/A'}`);
      console.log('---');
    });

    // Summary
    const productsWithSizes = products.filter(p => p.sizes && p.sizes.length > 0);
    const productsWithoutSizes = products.filter(p => !p.sizes || p.sizes.length === 0);
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`✅ Products WITH sizes: ${productsWithSizes.length}`);
    console.log(`❌ Products WITHOUT sizes: ${productsWithoutSizes.length}`);

    if (productsWithoutSizes.length > 0) {
      console.log(`\n🔧 Products that need sizes:`);
      productsWithoutSizes.forEach(p => {
        console.log(`   - ${p.name} (${p.category})`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run the script
checkProductSizes();
