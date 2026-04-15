const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (for correct IPs on Render)
app.set("trust proxy", true);

// ✅ FIXED CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://know-thy-self-ce-frontend.vercel.app", // ✅ CORRECT
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin received:", origin);

      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mbtiDB";

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Routes
    const mbtiRoutes = require("./routes/mbtiRoutes");
    app.use("/mbti", mbtiRoutes);

    const visitorsRouter = require("./routes/visitors");
    app.use("/api/visitors", visitorsRouter);

    // Test route
    app.get("/", (req, res) => res.send("Server is up! 🚀"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

startServer();
