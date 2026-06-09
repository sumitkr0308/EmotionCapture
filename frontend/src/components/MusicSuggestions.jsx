import React, { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";
import { emotionTheme } from "../theme/emotionTheme";
import { getAutoTextColor } from "../utils/getTextContrast";

export default function MusicSuggestions({ emotion }) {
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [playRequest, setPlayRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const theme = emotionTheme[emotion] || emotionTheme.neutral;
  const textColor =
    theme.text === "auto" ? getAutoTextColor(theme.background) : theme.text;
  const isBrightTheme = ["yellow", "orange", "pink", "amber", "lime"].some(
    (color) => theme.background.includes(color),
  );
  const mutedTextColor = isBrightTheme ? "text-gray-800/80" : "text-white/80";

  const fallbackAccent =
    emotion === "happy"
      ? "from-amber-300/40 to-orange-300/25"
      : emotion === "sad"
        ? "from-blue-300/30 to-indigo-300/20"
        : emotion === "angry"
          ? "from-red-300/35 to-rose-300/20"
          : emotion === "fearful"
            ? "from-purple-300/30 to-violet-300/20"
            : "from-slate-300/30 to-sky-300/20";

  const emotionColors = {
    happy: "shadow-yellow-400/40",
    sad: "shadow-blue-400/40",
    angry: "shadow-red-400/40",
    fearful: "shadow-purple-400/40",
    neutral: "shadow-gray-300/40",
  };

  useEffect(() => {
    if (!emotion) return;
    fetchVideos(emotion.toLowerCase());
  }, [emotion]);

  const fetchVideos = async (emotionKeyword) => {
    try {
      setLoading(true);
      setWarning("");
      setIsFallbackMode(false);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/youtube/search?mood=${emotionKeyword}`,
      );

      const data = await res.json();

      if (data?.kind === "youtube" && Array.isArray(data.items)) {
        setVideos(data.items);
        setSelectedVideos(data.items.filter((item) => item.youtubeId));
        setIsFallbackMode(Boolean(data.fallback));
        setLoading(false);

        if (data.items.length === 0) {
          setWarning("No videos found for this emotion. Try another emotion!");
        } else if (data.fallback) {
          setWarning(
            "YouTube search is rate-limited right now, so these are curated search links instead.",
          );
        }

        return;
      }

      const fallbackItems = Array.isArray(data) ? data : [];
      setVideos(fallbackItems);
      setSelectedVideos(fallbackItems.filter((item) => item.youtubeId));
      setLoading(false);

      if (fallbackItems.length === 0) {
        setWarning("No videos found for this emotion. Try another emotion!");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setLoading(false);
      setWarning("Could not fetch videos. Please try again.");
    }
  };

  const playVideo = (youtubeId) => {
    if (!youtubeId) return;

    const ordered = [...videos];
    const selectedIndex = ordered.findIndex(
      (video) => video.youtubeId === youtubeId,
    );

    if (selectedIndex >= 0) {
      const reordered = [
        ordered[selectedIndex],
        ...ordered.slice(0, selectedIndex),
        ...ordered.slice(selectedIndex + 1),
      ];
      setSelectedVideos(reordered);
      setPlayRequest((prev) => prev + 1);
      setWarning("");
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-1 sm:px-2 lg:px-0 max-h-[66vh] overflow-y-auto pr-2 music-scroll`}
    >
      {/* Loading */}
      {loading && (
        <div className={`animate-pulse text-sm sm:text-base ${textColor}`}>
          Searching YouTube videos...
        </div>
      )}

      {/* Warning */}
      {warning && (
        <p className="text-amber-300 text-xs sm:text-sm mb-3 leading-relaxed">
          {warning}
        </p>
      )}

      {/* Playlists */}
      <div className="space-y-4 mt-3">
        {videos.map((p) => (
          <div
            key={p.id}
            className={`
              group relative overflow-hidden p-4 sm:p-5 rounded-[1.5rem]
              flex flex-col sm:flex-row gap-4 sm:gap-5
              border border-white/10 bg-white/10 backdrop-blur-xl
              shadow-[0_10px_30px_rgba(0,0,0,0.18)]
              hover:bg-white/15 hover:shadow-[0_16px_40px_rgba(0,0,0,0.24)]
              transition-all duration-300
              ${emotionColors[emotion]}
            `}
          >
            {p.youtubeId ? null : (
              <div
                className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${fallbackAccent} opacity-90`}
              />
            )}

            {/* Video Thumbnail */}
            <div className="w-full sm:w-24 flex-shrink-0 mx-auto sm:mx-0">
              {p.youtubeId && p.thumbnail ? (
                <img
                  src={p.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-28 sm:h-24 rounded-2xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
                />
              ) : (
                <div
                  className={`
                    w-full h-28 sm:h-24 rounded-2xl
                    bg-gradient-to-br ${fallbackAccent}
                    border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.16)]
                    flex items-center justify-center
                  `}
                >
                  <div className="text-center">
                    <div className="text-lg font-black text-white/95">YT</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                      Search
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="flex flex-col justify-between flex-1 text-center sm:text-left">
              <div>
                <h3
                  className={`font-semibold text-base sm:text-lg leading-tight ${textColor}`}
                >
                  {p.title}
                </h3>

                <p
                  className={`text-xs sm:text-sm mt-1 line-clamp-2 ${mutedTextColor}`}
                >
                  {p.channel}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                {p.youtubeId ? (
                  <button
                    onClick={() => playVideo(p.youtubeId)}
                    className="
                      px-4 py-2 rounded-full 
                      bg-[#ff0000] text-white font-semibold
                      shadow-md hover:bg-[#cc0000] 
                      transition-all text-sm sm:text-base
                    "
                  >
                    ▶ Play
                  </button>
                ) : (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-4 py-2 rounded-full 
                      bg-[#ff0000] text-white font-semibold
                      shadow-md hover:bg-[#cc0000] 
                      transition-all text-sm sm:text-base
                    "
                  >
                    ▶ Open Search
                  </a>
                )}

                {p.youtubeId ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      px-4 py-2 rounded-full bg-white/10 
                      border border-white/20 
                      hover:bg-white/20 transition-all 
                      shadow-md text-sm sm:text-base
                      ${isBrightTheme ? "text-gray-900" : textColor}
                    `}
                  >
                    ▶ Open
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Music Player */}
      {!isFallbackMode && selectedVideos.length > 0 && (
        <div className="mt-6">
          <MusicPlayer
            tracks={selectedVideos}
            emotion={emotion}
            autoPlayKey={playRequest}
          />
        </div>
      )}
    </div>
  );
}
