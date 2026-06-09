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

const fallbackSuggestions = {
  happy: [
    {
      title: "Bollywood Happy Songs",
      channel: "Curated mood search",
      query: "bollywood happy songs",
    },
    {
      title: "Feel Good Hindi Songs",
      channel: "Curated mood search",
      query: "feel good hindi songs",
    },
    {
      title: "Indian Party Songs",
      channel: "Curated mood search",
      query: "indian party songs",
    },
  ],
  sad: [
    {
      title: "Bollywood Sad Songs",
      channel: "Curated mood search",
      query: "bollywood sad songs",
    },
    {
      title: "Hindi Heartbreak Songs",
      channel: "Curated mood search",
      query: "hindi heartbreak songs",
    },
    {
      title: "Soft Hindi Songs",
      channel: "Curated mood search",
      query: "soft hindi songs",
    },
  ],
  angry: [
    {
      title: "Bollywood Motivation Songs",
      channel: "Curated mood search",
      query: "bollywood motivation songs",
    },
    {
      title: "Hindi Workout Songs",
      channel: "Curated mood search",
      query: "hindi workout songs",
    },
    {
      title: "High Energy Indian Songs",
      channel: "Curated mood search",
      query: "high energy indian songs",
    },
  ],
  fearful: [
    {
      title: "Calm Hindi Music",
      channel: "Curated mood search",
      query: "calm hindi music",
    },
    {
      title: "Relaxing Bollywood Songs",
      channel: "Curated mood search",
      query: "relaxing bollywood songs",
    },
    {
      title: "Hindi Lo-fi Music",
      channel: "Curated mood search",
      query: "hindi lo-fi music",
    },
  ],
  neutral: [
    {
      title: "Hindi Chill Songs",
      channel: "Curated mood search",
      query: "hindi chill songs",
    },
    {
      title: "Bollywood Acoustic Songs",
      channel: "Curated mood search",
      query: "bollywood acoustic songs",
    },
    {
      title: "Relaxing Hindi Songs",
      channel: "Curated mood search",
      query: "relaxing hindi songs",
    },
  ],
};

function buildFallbackItems(mood) {
  return (fallbackSuggestions[mood] || fallbackSuggestions.neutral).map(
    (item, index) => ({
      id: `${mood}-${index}`,
      title: item.title,
      channel: item.channel,
      thumbnail: `https://via.placeholder.com/320x180.png?text=${encodeURIComponent(item.title)}`,
      youtubeId: null,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.query)}`,
    }),
  );
}

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

        if (err.response?.status === 429) {
          return null;
        }
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

    if (!videos) {
      console.log("YouTube quota exhausted, using fallback suggestions");
      return res.json({ kind: "youtube", items: buildFallbackItems(mood), fallback: true });
    }

    console.log("YouTube search returned", videos.length, "unique videos");

    if (videos.length === 0) {
      return res.json({ kind: "youtube", items: buildFallbackItems(mood), fallback: true });
    }

    return res.json({ kind: "youtube", items: videos.slice(0, 12) });
  } catch (err) {
    console.log("YouTube search error:", err.response?.data || err.message);
    return res.status(500).json({ error: "YouTube search failed" });
  }
};
