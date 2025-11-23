const axios = require("axios");
const { getSpotifyToken } = require("../utils/spotify");

// Hindi + English Smart Search Queries
const queryMap = {
  happy: [
    "happy upbeat bollywood mix",
    "happy english party mix",
    "bollywood dance mix"
  ],
  sad: [
    "sad hindi acoustic",
    "sad bollywood unplugged",
    "english sad acoustic mix"
  ],
  angry: [
    "bollywood workout energy",
    "rock workout english",
    "motivational gym hindi"
  ],
  fearful: [
    "hindi calm meditation",
    "english peaceful meditation",
    "relaxing background hindi"
  ],
  neutral: [
    "lofi hindi beats",
    "lofi indian chill mix",
    "lofi beats mix english"
  ]
};

// ✅ Search Playlists (Hindi + English + Guaranteed Previews)
exports.searchPlaylists = async (req, res) => {
  try {
    const mood = (req.query.mood || "neutral").toLowerCase();
    const token = await getSpotifyToken();

    const queries = queryMap[mood] || queryMap["neutral"];

    let allPlaylists = [];

    // Search multiple queries for better results
    for (const q of queries) {
      const resp = await axios.get("https://api.spotify.com/v1/search", {
        params: { q, type: "playlist", limit: 5 },
        headers: { Authorization: `Bearer ${token}` }
      });

      allPlaylists.push(...(resp.data.playlists?.items || []));
    }

    // Remove duplicates / invalid
    const unique = allPlaylists.filter((p) => p?.id);

    // Rank playlists by preview track count
    const checked = await Promise.all(
      unique.map(async (p) => {
        try {
          const tracksResp = await axios.get(
            `https://api.spotify.com/v1/playlists/${p.id}/tracks`,
            {
              params: { limit: 20, market: "IN" },
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          const items = tracksResp.data.items || [];
          const previewCount = items.reduce((sum, it) => {
            const t = it.track;
            return sum + (t && t.preview_url ? 1 : 0);
          }, 0);

          return {
            id: p.id,
            name: p.name,
            description: p.description,
            images: p.images,
            previewCount
          };
        } catch {
          return {
            id: p.id,
            name: p.name,
            description: p.description,
            images: p.images,
            previewCount: 0
          };
        }
      })
    );

    // Keep only playlists with preview tracks
    const final = checked
      .filter((p) => p.previewCount > 0)
      .sort((a, b) => b.previewCount - a.previewCount)
      .slice(0, 5);

    res.json(final);
  } catch (err) {
    console.error("searchPlaylists error:", err.response?.data || err.message);
    res.status(500).json({ error: "Spotify search failed" });
  }
};

// ✅ Get Tracks (Only previewable)
exports.getPlaylistTracks = async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const playlistId = req.params.id;

    const resp = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        params: { limit: 50, market: "IN" },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const items = resp.data.items || [];

    const tracks = items
      .map((i) => i.track)
      .filter((t) => t && t.preview_url)
      .map((track) => ({
        id: track.id,
        name: track.name,
        preview_url: track.preview_url,
        artists: track.artists.map((a) => a.name).join(", "),
        album_image: track.album.images[0]?.url,
      }));

    res.json(tracks);
  } catch (err) {
    console.error("getPlaylistTracks error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
};
