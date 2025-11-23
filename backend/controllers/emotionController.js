const Session = require("../models/Session");

exports.saveEmotionSession = async (req, res) => {
  try {
    const session = await Session.create(req.body);
    res.json({ success: true, id: session._id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllSessions = async (req, res) => {
  const data = await Session.find().sort({ timestamp: -1 }).limit(25);
  res.json(data);
};

exports.capturePhoto=async (req, res) => {
  try {
    const { image, emotion, time } = req.body;

    const saved = await Session.create({
      summaryEmotion: emotion,
      timestamp: time,
      imageBase64: image,
    });

    res.json({ success: true, id: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
