import { Router } from "express";

const userRouter = Router();

// The `:id` in the route path is a **route parameter**, which makes the route dynamic.
// Instead of hardcoding a specific user ID (e.g., `/users/123`), `:id` acts as a placeholder.
// When a request is made to a route like `/users/45`, Express matches it to `/users/:id`
// and assigns `45` to `req.params.id`. You can then use this value inside the route handler.

userRouter.get("/", (req, res) => res.send({ title: "GET all users" }));
userRouter.get("/:id", (req, res) => res.send({ title: "GET user details" }));
userRouter.post("/", (req, res) => res.send({ title: "CREATE new user" }));
userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE user" }));
userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE user" }));

export default userRouter;
