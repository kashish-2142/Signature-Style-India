// Cart context to manage shopping cart state across the app
import React, { createContext, useContext, useReducer, useEffect } from "react";

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
  totalItems: 0,
  totalAmount: 0,
};

// Reducer function to handle cart state changes
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const { product, size, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product._id === product._id && item.size === size
      );

      let newItems;
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        newItems = [...state.items, { product, size, quantity }];
      }

      return calculateTotals({ ...state, items: newItems });

    case "REMOVE_FROM_CART":
      const filteredItems = state.items.filter(
        (item) =>
          !(
            item.product._id === action.payload.productId &&
            item.size === action.payload.size
          )
      );
      return calculateTotals({ ...state, items: filteredItems });

    case "UPDATE_QUANTITY":
      const updatedItems = state.items.map((item) =>
        item.product._id === action.payload.productId &&
        item.size === action.payload.size
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return calculateTotals({ ...state, items: updatedItems });

    case "CLEAR_CART":
      return { items: [], totalItems: 0, totalAmount: 0 };

    default:
      return state;
  }
};

// Helper function to calculate totals
const calculateTotals = (state) => {
  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalAmount = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  return { ...state, totalItems, totalAmount };
};

// Context provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.items));
  }, [state.items]);

  // Add item to cart
  const addToCart = (product, size, quantity = 1) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { product, size, quantity },
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, size) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { productId, size },
    });
  };

  // Update item quantity
  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, size, quantity },
      });
    }
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const value = {
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
