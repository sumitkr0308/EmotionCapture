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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.FRONTEND_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);



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
