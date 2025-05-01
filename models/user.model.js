// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Define a schema for the User model using mongoose.Schema
// A schema outlines the structure of the documents in the MongoDB collection
const userSchema = new mongoose.Schema(
  {
    // 'name' field: must be a string, required, trimmed, with min and max length
    name: {
      type: String, // The data type
      required: [true, "Username is required."], // Field must be provided; custom error message
      trim: true, // Removes leading and trailing spaces
      minLength: 3, // Minimum allowed characters
      maxLength: 50, // Maximum allowed characters
    },

    // 'email' field: must be a unique, trimmed, lowercase string and match a regex pattern
    email: {
      type: String,
      required: [true, "Email is required."], // Field must be provided
      unique: true, // No two users can have the same email
      trim: true, // Removes surrounding spaces
      lowercase: true, // Converts email to lowercase before saving
      match: [
        /^[\w.+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/i, // Regex to validate email format
        "Please enter valid email address.", // Error message if regex fails
      ],
    },

    // 'password' field: must be a string, required, and at least 8 characters long
    password: {
      type: String,
      required: [true, "Password is required."], // Field must be provided
      minLength: 8, // Minimum 8 characters required
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` timestamps to each document
    timestamps: true,
  }
);

// Create a Mongoose model called "User" based on the defined schema
// A model is a constructor function that allows you to interact with the corresponding MongoDB collection
const User = mongoose.model("User", userSchema);

// Export the model so it can be used in other parts of the application
export default User;
