// Script to seed the database with sample data
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
require("dotenv").config();

// Sample products data - Jeans for Men, Women, and Kids with different fits
const sampleProducts = [
  // Men's jeans - Various fits
  {
    name: "Men's Classic Straight Fit Jeans",
    description:
      "Comfortable straight-fit jeans made from premium denim. Perfect for casual and semi-formal occasions. Timeless design that never goes out of style.",
    price: 2999,
    category: "Men",
    sizes: ["30", "32", "34", "36", "38"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    stock: 25,
  },
  {
    name: "Men's Slim Fit Dark Denim",
    description:
      "Modern slim-fit jeans that offer style and comfort. Made with stretch denim for better mobility. Perfect for a contemporary look.",
    price: 3499,
    category: "Men",
    sizes: ["28", "30", "32", "34", "36"],
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop",
    stock: 30,
  },
  {
    name: "Men's Regular Fit Blue Jeans",
    description:
      "Classic regular-fit jeans with a comfortable cut through the seat and thigh. Made from durable cotton denim for everyday wear.",
    price: 2599,
    category: "Men",
    sizes: ["32", "34", "36", "38", "40"],
    image:
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Men's Relaxed Fit Comfort Jeans",
    description:
      "Ultimate comfort with relaxed-fit jeans. Extra room through the seat and thigh for maximum comfort during long wear.",
    price: 2799,
    category: "Men",
    sizes: ["32", "34", "36", "38", "40", "42"],
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    stock: 28,
  },
  {
    name: "Men's Skinny Fit Black Jeans",
    description:
      "Trendy skinny-fit jeans in classic black. Made with stretch technology for a comfortable, form-fitting silhouette.",
    price: 3699,
    category: "Men",
    sizes: ["28", "30", "32", "34", "36"],
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
    stock: 22,
  },
  {
    name: "Men's Bootcut Vintage Wash",
    description:
      "Classic bootcut jeans with a slight flare from the knee down. Perfect for pairing with boots. Authentic vintage wash finish.",
    price: 3199,
    category: "Men",
    sizes: ["30", "32", "34", "36", "38", "40"],
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
    stock: 26,
  },

  // Women's jeans - Various fits
  {
    name: "Women's High-Waist Skinny Jeans",
    description:
      "Trendy high-waist skinny jeans that enhance your silhouette. Made with premium stretch denim for comfort and style.",
    price: 3799,
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Women's Straight Leg Classic",
    description:
      "Classic straight leg jeans with a timeless design. Comfortable mid-rise fit that flatters all body types.",
    price: 3299,
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop",
    stock: 32,
  },
  {
    name: "Women's Bootcut Flare Jeans",
    description:
      "Flattering bootcut jeans with a subtle flare. Perfect for pairing with heels or boots. Classic five-pocket styling.",
    price: 3399,
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
    stock: 28,
  },
  {
    name: "Women's Mom Fit Vintage",
    description:
      "Vintage-inspired mom jeans with a relaxed fit. High-waisted design perfect for creating trendy casual outfits.",
    price: 2899,
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop",
    stock: 24,
  },
  {
    name: "Women's Slim Fit Low Rise",
    description:
      "Modern slim-fit jeans with a low-rise cut. Made with stretch denim for a comfortable, flattering fit.",
    price: 3499,
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/assets/women_slim_fit.jpg",
    stock: 30,
  },
  {
    name: "Women's Regular Fit Comfort",
    description:
      "Comfortable regular-fit jeans designed for all-day wear. Classic mid-rise with a relaxed cut through the hip and thigh.",
    price: 2799,
    category: "Women",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=400&h=400&fit=crop",
    stock: 33,
  },

  // Kids' jeans - Various fits
  {
    name: "Kids' Straight Leg Classic",
    description:
      "Durable and comfortable straight-leg jeans designed for active kids. Features reinforced knees for extra durability.",
    price: 1599,
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1503944168903-c28ac023b9c6?w=400&h=400&fit=crop",
    stock: 40,
  },
  {
    name: "Kids' Slim Fit Stretch",
    description:
      "Modern slim-fit jeans for kids with stretch technology. Comfortable and stylish for school or play.",
    price: 1799,
    category: "Kids",
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop",
    stock: 32,
  },
  {
    name: "Kids' Regular Fit Blue Jeans",
    description:
      "Timeless regular-fit blue jeans for kids. Easy to wash and maintain, perfect for everyday wear and adventures.",
    price: 1399,
    category: "Kids",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
    stock: 38,
  },
  {
    name: "Kids' Relaxed Fit Comfort",
    description:
      "Comfortable relaxed-fit jeans with extra room for growing kids. Adjustable waist for the perfect fit.",
    price: 1699,
    category: "Kids",
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop",
    stock: 35,
  },
  {
    name: "Kids' Skinny Fit Fashion",
    description:
      "Trendy skinny-fit jeans for fashion-forward kids. Made with stretch denim for comfort during active play.",
    price: 1649,
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop",
    stock: 28,
  },
  {
    name: "Kids' Bootcut Adventure",
    description:
      "Fun bootcut jeans perfect for little adventurers. Durable construction with a slight flare for a stylish look.",
    price: 1499,
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    stock: 30,
  },
];

// Sample users data
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@demo.com",
    password: "password123",
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "user@demo.com",
    password: "password123",
    isAdmin: false,
  },
];

const bcrypt = require("bcryptjs");

// Function to seed the database
const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB at:", process.env.MONGODB_URI);
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});

    // Hash passwords for all users before insertMany
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      }))
    );

    // Add sample users
    console.log("Adding sample users...");
    await User.insertMany(hashedUsers);
    console.log(`Added ${sampleUsers.length} users`);

    // Add sample products
    console.log("Adding sample products...");
    await Product.insertMany(sampleProducts);
    console.log(`Added ${sampleProducts.length} products`);

    console.log("Database seeding completed successfully!");
    console.log("\nSample login credentials:");
    console.log("Admin: admin@demo.com / password123");
    console.log("User: user@demo.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
seedDatabase();
