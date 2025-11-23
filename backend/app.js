require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const emotionRoutes = require("./routes/emotions");
const spotifyRoutes = require("./routes/spotify");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
