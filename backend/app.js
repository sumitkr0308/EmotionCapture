require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const emotionRoutes = require("./routes/emotions");
const spotifyRoutes = require("./routes/spotify");

const app = express();

// ---------------------------------------------
// FIXED CORS FOR EXPRESS v5 / NODE 22
// ---------------------------------------------
const allowedOrigins = [
  "http://localhost:5173", // Local dev environment
  (process.env.FRONTEND_URL || "").replace(/\/$/, "") // Remove trailing slash for Vercel URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server, mobile apps, or Postman (no origin)
    if (!origin) return callback(null, true);

    const normalized = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions)); // Do NOT use app.options("*") — breaks on Node 22

// ---------------------------------------------
// Parsers
// ---------------------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------------------------------------------
// Health Check
// ---------------------------------------------
app.get("/", (req, res) => res.send("API is up"));

// ---------------------------------------------
// API Routes
// ---------------------------------------------
app.use("/api/emotions", emotionRoutes);
app.use("/api/spotify", spotifyRoutes);

// ---------------------------------------------
// Start Server
// ---------------------------------------------
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URL;

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB Error:", err.message));
