// Authentication context to manage user login state across the app
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

// Create context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
};

// Reducer function to handle state changes
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Context provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: response.data.user,
              token,
            },
          });
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log("🔍 Attempting login with:", { email, password });
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authAPI.login(email, password);
      console.log("✅ Login API response:", response.data);

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });

      return { success: true };
    } catch (error) {
      console.log("❌ Login API error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authAPI.signup(name, email, password);

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
