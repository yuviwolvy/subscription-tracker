// Import the express module to create a server
import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleWare from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

// Create an Express application instance
const app = express();

// 1. Parse incoming JSON data
app.use(express.json());
/*
Example:
If a POST request is sent with a JSON body:
{
  "name": "Yuvraj",
  "email": "yuvraj@example.com"
}

Then in your route handler:
req.body => { name: 'Yuvraj', email: 'yuvraj@example.com' }
*/

// 2. Parse URL-encoded data (e.g., from HTML form submissions)
app.use(express.urlencoded({ extended: false }));
/*
Example:
If a form sends data like:
name=Yuvraj&email=yuvraj%40example.com

Then in your route handler:
req.body => { name: 'Yuvraj', email: 'yuvraj@example.com' }

Note: extended: false means nested objects like address[city]=ABC won't be parsed into nested structures.
*/

// 3. Parse cookies from the request header
app.use(cookieParser());
/*
Example:
If the request has a header like:
Cookie: token=abc123; userId=42

Then in your route handler:
req.cookies => { token: 'abc123', userId: '42' }

Useful for authentication or tracking users.
*/

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleWare);

// Define a GET route for the root URL ("/")
// When someone visits http://localhost:3000/, this function will run
app.get("/", (req, res) => {
  // Send a simple response back to the browser
  res.send("Welcome to subscription tracker");
});

// Start the server and listen on port 3000
// When the server starts successfully, log a message in the console
app.listen(PORT, async () => {
  console.log(`Subscription tracker running on http://localhost:${PORT}`);

  await connectToDatabase();
});

// Export the app instance so it can be used in other files (e.g., for testing)
export default app;
