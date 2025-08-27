# DenimStore - MERN Stack Ecommerce Website

A simple ecommerce website for denim jeans built with React.js, Express.js, and MongoDB.

## Features

- **Homepage** with three categories: Men, Women, and Kids
- **Product listing** pages for each category
- **Product detail** pages with size selection
- **Shopping cart** functionality
- **User authentication** (login/signup) with JWT
- **Simple checkout** process with order confirmation
- **Order history** for users
- **Admin panel** for adding new products
- **Responsive design** for mobile and desktop

## Project Structure

```
DenimStore/
├── backend/          # Express.js server
│   ├── models/       # MongoDB models (User, Product, Order)
│   ├── routes/       # API routes
│   ├── middleware/   # Authentication middleware
│   └── server.js     # Main server file
└── frontend/         # React.js client
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── context/      # React context for state management
    │   └── services/     # API service functions
    └── public/
```

## Technologies Used

### Backend

- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend

- **React.js** - Frontend library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management (no Redux for simplicity)
- **CSS** - Simple styling without frameworks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (already created with default values):

   ```
   MONGODB_URI=mongodb://localhost:27017/denim-store
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. Make sure MongoDB is running on your system

5. Seed the database with sample data:

   ```bash
   node seed.js
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The app will run on http://localhost:3000

## Sample Login Credentials

After running the seed script, you can use these credentials:

- **Admin User**: admin@demo.com / password123
- **Regular User**: user@demo.com / password123

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Products

- `GET /api/products` - Get all products (with optional category filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order

## Features Explained

### User Authentication

- Uses JWT tokens for secure authentication
- Passwords are hashed using bcryptjs
- Protected routes require valid JWT token

### Shopping Cart

- Managed using React Context API
- Persisted in localStorage
- Supports adding, removing, and updating quantities

### Product Management

- Admin users can add new products
- Products have categories, sizes, prices, and images
- Stock management included

### Order System

- Simple checkout process with shipping address
- Order history for users
- Order status tracking

## Code Comments

The code includes comprehensive comments explaining:

- How each component works
- Purpose of each function
- API endpoint functionality
- State management logic
- Authentication flow

## Production Deployment

For production deployment:

1. Update environment variables
2. Use a cloud MongoDB service (MongoDB Atlas)
3. Deploy backend to services like Heroku, Railway, or AWS
4. Deploy frontend to services like Netlify, Vercel, or AWS S3
5. Update API URLs in frontend to point to production backend

## License

This project is for educational purposes.
