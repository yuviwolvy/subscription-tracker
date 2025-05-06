import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  // This line starts a new MongoDB session using Mongoose.
  // Note: This is **not** related to a "user session" (like login/logout sessions).
  // Instead, it's used for database-level session management — particularly for transactions.
  //
  // A MongoDB session allows us to group multiple read/write operations into a single **transaction**.
  // Transactions ensure **atomicity**, meaning either all operations in the transaction succeed together,
  // or if any one fails, all changes are rolled back — leaving the database in a consistent state.
  //
  // This is helpful when you need to update multiple collections/documents and ensure they all succeed together.
  // For example, deducting money from one account and adding it to another — both must happen together or not at all.
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Searches the "User" collection for a document with the specified email.
    // Returns the first matching user document if found, otherwise returns null.
    // Useful for checking if a user already exists before actions like registration or login.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Creates a new Error object with a custom message.
      // Adds a custom "statusCode" property (409 in this case) to the error object.
      // This error is then thrown, which immediately stops further execution in this function.
      //
      // The thrown error is typically caught by an error-handling middleware (in Express apps).
      // That middleware can then read the `statusCode` and `message` from the error object,
      // and use them to send an HTTP response to the client.
      //
      // For example, if this is in an Express route, the error might be caught like this:
      //   res.status(error.statusCode).json({ message: error.message });
      const error = new Error("User already exists.");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    // Generates a JWT (JSON Web Token) with the user's ID as the payload.
    // `jwt.sign()` creates a signed token using the provided payload, secret key, and options.
    //
    // Payload: { userId: newUsers[0]._id } - the data embedded in the token (can be decoded later).
    // Secret: JWT_SECRET (a string like 'mysecretkey') - a private key used to digitally sign the token.
    //        It ensures that the token has not been tampered with. The secret is combined with the token's
    //        header and payload using a cryptographic hashing algorithm (like HMACSHA256) to create the
    //        signature. The secret must be kept secure to prevent malicious users from generating fake tokens.
    // Options: { expiresIn: JWT_EXPIRES_IN } - sets the expiration time of the token (e.g., '1h', '7d').
    //
    // The resulting token can be sent to the client, and the server can verify it later by using the same
    // secret key (JWT_SECRET) to ensure the token is authentic and has not been altered.
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User does not exist.");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Incorrect Password.");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {};
