
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const emotionRoutes = require("./routes/emotions");
const spotifyRoutes = require("./routes/spotify");

const app = express();

// allow only your frontend (replace with your actual Vercel URL)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// health check
app.get("/", (req, res) => res.send("API is up"));

// ROUTES
app.use("/api/emotions", emotionRoutes);
app.use("/api/spotify", spotifyRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URL;

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB Error:", err.message));
