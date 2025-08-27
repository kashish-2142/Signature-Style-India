const axios = require("axios");

async function testFrontendLogin() {
  try {
    console.log("Testing frontend login API call...");

    const response = await axios.post(
      "http://localhost:5001/api/auth/login",
      {
        email: "admin@demo.com",
        password: "password123",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Login successful!");
    console.log("Status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    console.log("❌ Login failed!");
    console.log("Status:", error.response?.status);
    console.log("Error data:", error.response?.data);
    console.log("Error message:", error.message);
  }
}

testFrontendLogin();
