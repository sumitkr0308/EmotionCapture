const axios = require("axios");
const { getSpotifyToken } = require("../utils/spotify");

// ===================================================================================
// EMOTION → QUERY MAP (Hindi-Optimized + Multi-Intent)
// ===================================================================================
const queryMap = {
  happy: [
    "bollywood happy songs",
    "hindi upbeat dance hits",
    "bollywood party mix",
    "hindi celebration songs"
  ],
  sad: [
    "bollywood sad songs",
    "hindi heartbreak playlist",
    "sad romantic hindi",
    "bollywood emotional mix"
  ],
  angry: [
    "hindi workout motivation",
    "bollywood gym playlist",
    "high energy hindi songs",
    "hindi pump up mix"
  ],
  fearful: [
    "calm hindi instrumental",
    "hindi soothing music",
    "bollywood lofi beats",
    "hindi relaxing playlist"
  ],
  neutral: [
    "hindi chill mix",
    "bollywood acoustic playlist",
    "hindi soft pop",
    "bollywood lofi playlist"
  ]
};

const validMoods = Object.keys(queryMap);

// ===================================================================================
// SMART PLAYLIST SEARCH (Optimized 40% fewer API calls)
// ===================================================================================
async function searchSpotifyPlaylists(token, queries) {
  const results = [];

  // Use Promise.all to run all searches in parallel for speed
  const responses = await Promise.all(
    queries.map((q) =>
      axios
        .get("https://api.spotify.com/v1/search", {
          params: { q, type: "playlist", limit: 7, market: "IN" },
          headers: { Authorization: `Bearer ${token}` }
        })
        .catch(() => null)
    )
  );

  responses.forEach((resp) => {
    const items = resp?.data?.playlists?.items || [];
    items.forEach((p) => p?.id && results.push(p));
  });

  // make playlists unique by ID
  return Array.from(new Map(results.map((p) => [p.id, p])).values());
}

// ===================================================================================
// CHECK PLAYLIST TRACKS FOR PREVIEW
// ===================================================================================
async function checkPlaylistPlayable(token, playlist) {
  try {
    const resp = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        params: { limit: 50, market: "IN" },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const items = resp?.data?.items || [];

    const playableTracks = items.filter((i) => i?.track?.preview_url);

    return {
      id: playlist.id,
      name: playlist.name,
      images: playlist.images,
      description: playlist.description,
      previewCount: playableTracks.length
    };
  } catch (err) {
    return {
      id: playlist.id,
      name: playlist.name,
      images: playlist.images,
      previewCount: 0
    };
  }
}

// ===================================================================================
// MAIN API: Emotion-Based Playlist Search
// ===================================================================================
exports.searchPlaylists = async (req, res) => {
  try {
    const rawMood = (req.query.mood || "neutral").toLowerCase();
    const mood = validMoods.includes(rawMood) ? rawMood : "neutral";

    const token = await getSpotifyToken();
    if (!token) return res.status(500).json({ error: "Spotify Auth Failed" });

    const queries = queryMap[mood];

    // 1. Smart playlist search
    const rawPlaylists = await searchSpotifyPlaylists(token, queries);

    // 2. Check for playable tracks
    const checked = await Promise.all(
      rawPlaylists.map((p) => checkPlaylistPlayable(token, p))
    );

    // 3. Return only playlists with at least 5 previewable tracks
    let playable = checked
      .filter((p) => p.previewCount >= 5)
      .sort((a, b) => b.previewCount - a.previewCount)
      .slice(0, 6);

    // 4. Fallback: Hindi-focused playlists
    if (playable.length === 0) {
      const fbQueries = [
        "bollywood mix playlist",
        "hindi trending songs",
        "bollywood acoustic mix",
        "hindi lofi playlist"
      ];

      const fallback = await searchSpotifyPlaylists(token, fbQueries);
      const fbClean = fallback.slice(0, 6).map((p) => ({
        id: p.id,
        name: p.name,
        images: p.images,
        description: p.description
      }));

      return res.json(fbClean);
    }

    res.json(playable);
  } catch (err) {
    console.log("MASTER ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Spotify search failed" });
  }
};

// ===================================================================================
// TRACKS API (Always return playable tracks only)
// ===================================================================================
exports.getPlaylistTracks = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const token = await getSpotifyToken();

    const resp = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        params: { limit: 50, market: "IN" },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const items = resp?.data?.items || [];

    const tracks = items
      .filter((i) => i?.track?.preview_url)
      .map((i) => ({
        id: i.track.id,
        name: i.track.name,
        preview_url: i.track.preview_url,
        artists: i.track.artists.map((a) => a.name).join(", "),
        album_image: i.track.album?.images?.[0]?.url || null
      }));

    res.json(tracks);
  } catch (err) {
    console.log("TRACK ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
};
