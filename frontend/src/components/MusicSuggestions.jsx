import React, { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";

export default function MusicSuggestions({ emotion }) {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const emotionColors = {
    happy: "shadow-yellow-400/40",
    sad: "shadow-blue-400/40",
    angry: "shadow-red-400/40",
    fearful: "shadow-purple-400/40",
    neutral: "shadow-gray-300/40"
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
    <div className="text-white">
    

      {/* Loading */}
      {loading && (
        <div className="animate-pulse text-gray-400">Searching playlists...</div>
      )}

      {/* Warning */}
      {warning && (
        <p className="text-red-400 text-sm mb-3">{warning}</p>
      )}

      {/* Spotify Style Playlist Cards */}
      <div className="space-y-4">
        {playlists.map((p) => (
          <div
            key={p.id}
            className={`group relative p-4 rounded-xl flex gap-4 border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl hover:bg-white/10 hover:scale-[1.01] transition-all duration-300 ${emotionColors[emotion]}`}
          >
            {/* Album Art */}
            <div className="w-20 h-20 rounded-md overflow-hidden shadow-md flex-shrink-0">
              <img
                src={p.images?.[0]?.url}
                alt="Playlist cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Section */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-semibold text-lg leading-tight text-white">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>

              {/* Buttons Row */}
              <div className="flex items-center justify-start gap-4 mt-4 flex-nowrap w-full">

                {/* Spotify Green Preview Button */}
                <button
                  onClick={() => playFromPlaylist(p.id)}
                  className="px-5 py-2.5 rounded-full bg-[#1DB954] text-black font-semibold flex items-center gap-1 hover:bg-[#1ed760] transition-all"
                  disabled={trackLoading}
                >
                  ▶ Preview
                </button>

                {/* Open on Spotify */}
                <a
                  href={`https://open.spotify.com/playlist/${p.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white flex items-center gap-1 hover:bg-white/20 transition-all"
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
        <div className="sticky bottom-5">
          <MusicPlayer tracks={tracks} emotion={emotion} />
        </div>
      )}
    </div>
  );
}
