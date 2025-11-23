const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  userId: { type: String, default: "anonymous" },
  timestamp: { type: Date, default: Date.now },
  emotions: [
    {
      emotion: String,
      confidence: Number,
      time: Number,
    },
  ],
  summaryEmotion: String,
  imageBase64: String
});

module.exports = mongoose.model("Session", SessionSchema);
