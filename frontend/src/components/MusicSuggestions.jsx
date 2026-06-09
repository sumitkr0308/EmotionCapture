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

  const theme = emotionTheme[emotion] || emotionTheme.neutral;
  const textColor =
    theme.text === "auto" ? getAutoTextColor(theme.background) : theme.text;
  const isBrightTheme = ["yellow", "orange", "pink", "amber", "lime"].some(
    (color) => theme.background.includes(color),
  );
  const mutedTextColor = isBrightTheme ? "text-gray-800/80" : "text-white/80";

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

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/youtube/search?mood=${emotionKeyword}`,
      );

      const data = await res.json();

      if (data?.kind === "youtube" && Array.isArray(data.items)) {
        setVideos(data.items);
        setSelectedVideos(data.items);
        setLoading(false);

        if (data.items.length === 0) {
          setWarning("No videos found for this emotion. Try another emotion!");
        }

        return;
      }

      const fallbackItems = Array.isArray(data) ? data : [];
      setVideos(fallbackItems);
      setSelectedVideos(fallbackItems);
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
        <p className="text-red-400 text-xs sm:text-sm mb-3">{warning}</p>
      )}

      {/* Playlists */}
      <div className="space-y-4 mt-3">
        {videos.map((p) => (
          <div
            key={p.id}
            className={`
              group relative p-4 sm:p-5 rounded-2xl 
              flex flex-col sm:flex-row gap-5 
              border border-white/10 bg-white/10 backdrop-blur-xl
              shadow-[0_10px_30px_rgba(0,0,0,0.25)]
              hover:bg-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]
              hover:scale-[1.015]
              transition-all duration-300
              ${emotionColors[emotion]}
            `}
          >
            {/* Video Thumbnail */}
            <div className="w-20 h-20 sm:w-18 sm:h-18 rounded-xl overflow-hidden shadow-md flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={p.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
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

                {/* YouTube */}
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Music Player */}
      {selectedVideos.length > 0 && (
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
