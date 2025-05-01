import { config } from "dotenv";

//This decides which env's data to store in process.env
// NODE_ENV must be set manually via the terminal or a script before running the app.
// It determines which .env file (e.g., .env.development.local or .env.production.local) will be loaded.
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV, DB_URI } = process.env;
