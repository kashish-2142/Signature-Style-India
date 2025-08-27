const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // First, check all users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database:`);
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.email}) - Admin: ${user.isAdmin}`);
    });

    // Test finding admin user
    const adminUser = await User.findOne({ email: "admin@demo.com" });
    if (!adminUser) {
      console.log("❌ Admin user not found! Creating one...");

      const newAdmin = new User({
        name: "Admin User",
        email: "admin@demo.com",
        password: "password123",
        isAdmin: true,
      });

      await newAdmin.save();
      console.log("✅ Admin user created!");

      // Test again
      const createdAdmin = await User.findOne({ email: "admin@demo.com" });
      console.log(
        "Created admin:",
        createdAdmin.name,
        createdAdmin.email,
        "Admin:",
        createdAdmin.isAdmin
      );
    } else {
      console.log(
        "✅ Admin user found:",
        adminUser.name,
        adminUser.email,
        "Admin:",
        adminUser.isAdmin
      );

      // Test password comparison
      console.log("Stored password hash:", adminUser.password);
      const isPasswordValid = await adminUser.comparePassword("password123");
      console.log("Password validation result:", isPasswordValid);

      if (!isPasswordValid) {
        console.log(
          "❌ Password doesn't match! Let's check the bcrypt function..."
        );

        const bcrypt = require("bcryptjs");
        const manualCheck = await bcrypt.compare(
          "password123",
          adminUser.password
        );
        console.log("Manual bcrypt check:", manualCheck);

        // Delete and recreate the user
        console.log("Deleting and recreating admin user...");
        await User.deleteOne({ email: "admin@demo.com" });

        const newAdmin = new User({
          name: "Admin User",
          email: "admin@demo.com",
          password: "password123",
          isAdmin: true,
        });

        await newAdmin.save();
        console.log("✅ Admin user recreated!");

        // Test the new user
        const freshAdmin = await User.findOne({ email: "admin@demo.com" });
        console.log("Fresh admin password hash:", freshAdmin.password);
        const isFreshPasswordValid = await freshAdmin.comparePassword(
          "password123"
        );
        console.log("Fresh admin password validation:", isFreshPasswordValid);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();
