const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function testDB() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully");

    // Check if users exist
    const users = await User.find({});
    console.log("Existing users:", users.length);

    if (users.length === 0) {
      console.log("No users found. Creating admin user...");
      const adminUser = new User({
        name: "Admin User",
        email: "admin@demo.com",
        password: "password123", // This will be hashed by the pre-save hook
        isAdmin: true,
      });

      await adminUser.save();
      console.log("Admin user created successfully!");
    } else {
      console.log("Users found:");
      users.forEach((user) => {
        console.log(`- ${user.name} (${user.email}) - Admin: ${user.isAdmin}`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

testDB();
