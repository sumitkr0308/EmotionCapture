const axios = require("axios");

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

const moodQueries = {
  happy: [
    "bollywood happy songs",
    "hindi upbeat dance songs",
    "indian party songs",
    "bollywood celebration songs",
    "feel good hindi songs",
  ],
  sad: [
    "bollywood sad songs",
    "hindi heartbreak songs",
    "emotional indian songs",
    "sad bollywood songs",
    "hindi soft songs",
  ],
  angry: [
    "bollywood motivation songs",
    "hindi workout songs",
    "high energy indian songs",
    "pump up bollywood songs",
    "hindi power songs",
  ],
  fearful: [
    "calm hindi music",
    "relaxing bollywood songs",
    "soothing indian songs",
    "hindi lo-fi music",
    "ambient hindi music",
  ],
  neutral: [
    "hindi chill songs",
    "bollywood acoustic songs",
    "indian soft music",
    "hindi lo-fi songs",
    "relaxing hindi songs",
  ],
};

const searchPresets = [
  {
    label: "strict-in",
    params: {
      videoEmbeddable: "true",
      safeSearch: "none",
      regionCode: "IN",
    },
  },
  {
    label: "in",
    params: {
      safeSearch: "none",
      regionCode: "IN",
    },
  },
  {
    label: "global",
    params: {
      safeSearch: "none",
    },
  },
];

async function searchYouTubeVideos(apiKey, queries) {
  const results = [];

  for (const [queryIndex, query] of queries.entries()) {
    let response = null;

    for (const preset of searchPresets) {
      try {
        response = await axios.get(YOUTUBE_SEARCH_URL, {
          params: {
            key: apiKey,
            q: query,
            part: "snippet",
            type: "video",
            maxResults: 8,
            ...preset.params,
          },
        });

        const items = response?.data?.items || [];
        console.log(
          `YouTube search query[${queryIndex}] (${preset.label}) returned ${items.length} results`,
        );

        if (items.length > 0) break;
      } catch (err) {
        console.log(
          `YouTube search query[${queryIndex}] (${preset.label}) failed:`,
          err.response?.data || err.message,
        );
      }
    }

    const items = response?.data?.items || [];

    items.forEach((item) => {
      const youtubeId = item?.id?.videoId;
      if (!youtubeId) return;

      results.push({
        youtubeId,
        title: item.snippet?.title || "Untitled",
        channel: item.snippet?.channelTitle || "YouTube",
        thumbnail:
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          null,
        url: `https://www.youtube.com/watch?v=${youtubeId}`,
      });
    });
  }

  return Array.from(
    new Map(results.map((item) => [item.youtubeId, item])).values(),
  );
}

exports.searchVideos = async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "YOUTUBE_API_KEY missing" });
    }

    const rawMood = (req.query.mood || "neutral").toLowerCase();
    const mood = moodQueries[rawMood] ? rawMood : "neutral";
    const queries = moodQueries[mood];

    console.log("searchVideos called with mood=", rawMood, "resolved=", mood);

    const videos = await searchYouTubeVideos(apiKey, queries);
    console.log("YouTube search returned", videos.length, "unique videos");

    return res.json({ kind: "youtube", items: videos.slice(0, 12) });
  } catch (err) {
    console.log("YouTube search error:", err.response?.data || err.message);
    return res.status(500).json({ error: "YouTube search failed" });
  }
};
