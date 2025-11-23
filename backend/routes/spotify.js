const express = require("express");
const { searchPlaylists,getPlaylistTracks } = require("../controllers/spotifyController");
const router = express.Router();

router.get("/playlist", searchPlaylists);
router.get("/tracks/:id", getPlaylistTracks);


module.exports = router;
