const express = require("express");
const { saveEmotionSession, getAllSessions,capturePhoto } = require("../controllers/emotionController");
const router = express.Router();

router.post("/", saveEmotionSession);
router.get("/", getAllSessions);

router.post("/save-photo", capturePhoto);


module.exports = router;
