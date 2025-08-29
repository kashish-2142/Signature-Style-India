#!/usr/bin/env node

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Atlas connection string
const ATLAS_URI = 'mongodb+srv://kashishsrajawat_db_user:w7WqfrxofdXGTApc@denim-clothing.tyvkkhh.mongodb.net/denim-clothing';

// Local MongoDB connection string
const LOCAL_URI = 'mongodb://localhost:27017/denim-store';

console.log('🚀 Starting migration to MongoDB Atlas...\n');

async function migrateData() {
  try {
    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...');
    const localConnection = await mongoose.createConnection(LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to local MongoDB');

    // Connect to MongoDB Atlas
    console.log('📡 Connecting to MongoDB Atlas...');
    const atlasConnection = await mongoose.createConnection(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Define schemas for migration
    const UserSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      isAdmin: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const ProductSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      category: String,
      fit: String,
      size: [String],
      color: String,
      image: String,
      stock: Number,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const OrderSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
      }],
      totalAmount: Number,
      shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      },
      status: { type: String, default: 'pending' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    // Create models
    const LocalUser = localConnection.model('User', UserSchema);
    const LocalProduct = localConnection.model('Product', ProductSchema);
    const LocalOrder = localConnection.model('Order', OrderSchema);

    const AtlasUser = atlasConnection.model('User', UserSchema);
    const AtlasProduct = atlasConnection.model('Product', ProductSchema);
    const AtlasOrder = atlasConnection.model('Order', OrderSchema);

    // Migrate Users
    console.log('\n👥 Migrating users...');
    const users = await LocalUser.find({});
    if (users.length > 0) {
      await AtlasUser.insertMany(users);
      console.log(`✅ Migrated ${users.length} users`);
    } else {
      console.log('ℹ️  No users to migrate');
    }

    // Migrate Products
    console.log('\n🛍️  Migrating products...');
    const products = await LocalProduct.find({});
    if (products.length > 0) {
      await AtlasProduct.insertMany(products);
      console.log(`✅ Migrated ${products.length} products`);
    } else {
      console.log('ℹ️  No products to migrate');
    }

    // Migrate Orders
    console.log('\n📦 Migrating orders...');
    const orders = await LocalOrder.find({});
    if (orders.length > 0) {
      await AtlasOrder.insertMany(orders);
      console.log(`✅ Migrated ${orders.length} orders`);
    } else {
      console.log('ℹ️  No orders to migrate');
    }

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const atlasUserCount = await AtlasUser.countDocuments();
    const atlasProductCount = await AtlasProduct.countDocuments();
    const atlasOrderCount = await AtlasOrder.countDocuments();

    console.log(`📊 Atlas Database Summary:`);
    console.log(`   Users: ${atlasUserCount}`);
    console.log(`   Products: ${atlasProductCount}`);
    console.log(`   Orders: ${atlasOrderCount}`);

    // Close connections
    await localConnection.close();
    await atlasConnection.close();

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env file with the Atlas connection string');
    console.log('2. Test the application with the new database');
    console.log('3. Update deployment environment variables');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateData();
