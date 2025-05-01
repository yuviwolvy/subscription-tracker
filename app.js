// Import the express module to create a server
import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";

// Create an Express application instance
const app = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

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
