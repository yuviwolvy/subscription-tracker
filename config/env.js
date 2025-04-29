import { config } from "dotenv";

//This decides which env's data to store in process.env
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV } = process.env;
