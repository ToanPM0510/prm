import { config } from "dotenv";

// Load appropriate env file based on environment
const envFile = process.env.NODE_ENV === "production" 
  ? ".env.production.local" 
  : `.env.${process.env.NODE_ENV || "development"}.local`;

// For Vercel, we don't need to load from file since env vars are set directly
if (process.env.NODE_ENV !== "production") {
  config({ path: envFile });
}

export const {
  PORT = 5500,
  NODE_ENV,
  DB_URI,
  JWT_SECRET = "AVT",
  JWT_EXPIRES_IN = "1d",
  JWT_REFRESH_EXPIRES_IN = "7d",
  EMAIL_PASSWORD,
  EMAIL_ACCOUNT,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  VNP_TMN_CODE,
  VNP_HASH_SECRET,
  VNP_URL,
  VNP_RETURN_URL,
  VNP_API_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OPENAI_MODEL,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
} = process.env;
