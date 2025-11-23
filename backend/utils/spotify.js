const axios = require("axios");

let cachedToken = null;
let expiresAt = 0;

exports.getSpotifyToken = async () => {
  const now = Date.now();

  if (cachedToken && now < expiresAt) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.log("❌ Spotify ENV Missing:", { clientId, clientSecret });
    throw new Error("Spotify credentials missing");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    cachedToken = res.data.access_token;
    expiresAt = now + res.data.expires_in * 1000;

    return cachedToken;
  } catch (err) {
    console.log("❌ Spotify token error:", err.response?.data || err.message);
    return null;
  }
};

