import React, { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";
import { emotionTheme } from "../theme/emotionTheme";
import { getAutoTextColor } from "../utils/getTextContrast";

export default function MusicSuggestions({ emotion }) {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const theme = emotionTheme[emotion] || emotionTheme.neutral;
  const textColor =
    theme.text === "auto"
      ? getAutoTextColor(theme.background)
      : theme.text;

  const emotionColors = {
    happy: "shadow-yellow-400/40",
    sad: "shadow-blue-400/40",
    angry: "shadow-red-400/40",
    fearful: "shadow-purple-400/40",
    neutral: "shadow-gray-300/40",
  };

  useEffect(() => {
    if (!emotion) return;
    fetchPlaylists(emotion.toLowerCase());
  }, [emotion]);

  const fetchPlaylists = async (emotionKeyword) => {
    try {
      setLoading(true);
      setWarning("");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/spotify/playlist?mood=${emotionKeyword}`
      );

      const data = await res.json();
      setPlaylists(data);
      setLoading(false);

      if (data.length === 0) {
        setWarning("No playable music found for this emotion. Try another emotion!");
      }
    } catch (err) {
      console.error("Error fetching playlists:", err);
      setLoading(false);
      setWarning("Could not fetch music. Please try again.");
    }
  };

  const playFromPlaylist = async (playlistId) => {
    try {
      setTrackLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/spotify/tracks/${playlistId}`
      );
      let trackList = await res.json();

      if (trackList.length === 0) {
        setWarning("This playlist has no playable previews.");
        setTrackLoading(false);
        return;
      }

      setWarning("");
      setTracks(trackList);
      setTrackLoading(false);
    } catch (err) {
      setWarning("Error loading tracks.");
      setTrackLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0`}>

      {/* Loading */}
      {loading && (
        <div className={`animate-pulse text-sm sm:text-base ${textColor}`}>
          Searching playlists...
        </div>
      )}

      {/* Warning */}
      {warning && (
        <p className="text-red-400 text-xs sm:text-sm mb-3">
          {warning}
        </p>
      )}

      {/* Playlists */}
      <div className="space-y-5 mt-3">
        {playlists.map((p) => (
          <div
            key={p.id}
            className={`
              group relative p-5 sm:p-6 rounded-2xl 
              flex flex-col sm:flex-row gap-5 
              border border-white/10 bg-white/10 backdrop-blur-xl
              shadow-[0_10px_30px_rgba(0,0,0,0.25)]
              hover:bg-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]
              hover:scale-[1.015]
              transition-all duration-300
              ${emotionColors[emotion]}
            `}
          >
            {/* Album Art */}
            <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={p.images?.[0]?.url}
                alt="Playlist cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Playlist Info */}
            <div className="flex flex-col justify-between flex-1 text-center sm:text-left">
              <div>
                <h3 className={`font-semibold text-lg sm:text-xl leading-tight ${textColor}`}>
                  {p.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">

                {/* Preview */}
                <button
                  onClick={() => playFromPlaylist(p.id)}
                  className="
                    px-5 py-2 rounded-full 
                    bg-[#1DB954] text-black font-semibold
                    shadow-md hover:bg-[#1ed760] 
                    transition-all text-sm sm:text-base
                  "
                  disabled={trackLoading}
                >
                  ▶ Preview
                </button>

                {/* Spotify */}
                <a
                  href={`https://open.spotify.com/playlist/${p.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    px-5 py-2 rounded-full bg-white/10 
                    border border-white/20 
                    hover:bg-white/20 transition-all 
                    shadow-md text-sm sm:text-base
                    ${textColor}
                  `}
                >
                  🎧 Open
                </a>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Music Player */}
      {tracks.length > 0 && (
        <div className="mt-6">
          <MusicPlayer tracks={tracks} emotion={emotion} />
        </div>
      )}
    </div>
  );
}
