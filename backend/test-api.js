const axios = require("axios");

async function testLoginAPI() {
  try {
    console.log("Testing login API...");

    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: "admin@demo.com",
      password: "password123",
    });

    console.log("✅ Login successful!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("❌ Login failed!");
    console.log("Error:", error.response?.data || error.message);
  }
}

testLoginAPI();
