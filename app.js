import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { JWT_SECRET, PORT } from "./config/env.js";

import session from "express-session";
import passport from "./config/passport.js";

// Import the routers
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import addressRouters from "./routes/address.routes.js";
import adminRouter from "./routes/admin.routes.js";
import authRouter from "./routes/auth.routes.js";
import brandRouter from "./routes/brand.routes.js";
import cartRouter from "./routes/cart.routes.js";
import categoryRouter from "./routes/category.routes.js";
import checkoutRouter from "./routes/checkout.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:8081",
        "http://localhost:5173",
        "exp://10.33.75.15:8081",
        "http://10.33.75.15:8081",
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Check if the origin is allowed or if it's a vercel deployment
      if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.use(
  session({ secret: JWT_SECRET, resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/address", addressRouters);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use(errorMiddleware);

// Middleware to ensure database connection for each request with retry
app.use(async (req, res, next) => {
  const maxRetries = 2;
  let retries = 0;

  const attemptConnection = async () => {
    try {
      await connectToDatabase();
      next();
    } catch (error) {
      retries++;
      console.error(`Database connection attempt ${retries} failed:`, error.message);

      if (retries < maxRetries) {
        console.log(`Retrying connection (${retries}/${maxRetries})...`);
        setTimeout(attemptConnection, 1000); // Wait 1 second before retry
      } else {
        console.error("Max retries reached, connection failed");
        res.status(500).json({
          success: false,
          error: "Database connection failed after retries"
        });
      }
    }
  };

  await attemptConnection();
});

app.get("/", (req, res) => {
  res.send("Welcom to the SDN with Thopn3");
});

// Debug endpoint
app.get("/debug", async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    res.json({
      success: true,
      nodeEnv: process.env.NODE_ENV,
      dbUri: process.env.DB_URI ? "Set" : "Not set",
      mongooseReadyState: mongoose.default.connection.readyState,
      mongooseStates: {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      nodeEnv: process.env.NODE_ENV,
      dbUri: process.env.DB_URI ? "Set" : "Not set"
    });
  }
});

// Test database connection endpoint
app.get("/test-db", async (req, res) => {
  try {
    console.log("Testing database connection...");
    await connectToDatabase();

    // Try to perform a simple operation
    const mongoose = await import('mongoose');
    const db = mongoose.default.connection.db;
    const adminResult = await db.admin().ping();

    res.json({
      success: true,
      message: "Database connection successful",
      readyState: mongoose.default.connection.readyState,
      ping: adminResult
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      dbUri: process.env.DB_URI ? "Set" : "Not set"
    });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    console.log(`listening on http://localhost:${PORT}`);
    try {
      await connectToDatabase();
    } catch (error) {
      console.log("Database connection error:", error);
    }
  });
}

export default app;
