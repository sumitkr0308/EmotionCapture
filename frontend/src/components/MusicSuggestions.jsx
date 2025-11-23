import React, { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";

export default function MusicSuggestions({ emotion }) {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!emotion) return;
    fetchPlaylists(emotion);
  }, [emotion]);

  const fetchPlaylists = async (emotionKeyword) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/spotify/playlist?mood=${emotionKeyword}`
      );

      const data = await res.json();
      setPlaylists(data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  };

  const playFromPlaylist = async (playlistId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/spotify/tracks/${playlistId}`
      );

      let trackList = await res.json();

      // keep only previewable tracks
      trackList = trackList.filter((t) => t.preview_url);

      if (trackList.length === 0) {
        alert("No preview available in this playlist");
        return;
      }

      setTracks(trackList.slice(0, 5));
    } catch (err) {
      console.error("Error fetching tracks:", err);
    }
  };

  return (
    <div>
      {playlists.map((p) => (
        <div
          key={p.id}
          className="p-4 bg-slate-800/40 rounded-xl mb-3 flex gap-4"
        >
          <img
            src={p.images?.[0]?.url}
            className="w-20 h-20 rounded-lg object-cover"
          />

          <div>
            <h3 className="font-semibold">{p.name}</h3>

            <button
              className="mt-2 px-3 py-1 bg-indigo-600 rounded"
              onClick={() => playFromPlaylist(p.id)}
            >
              Play Preview
            </button>
          </div>
        </div>
      ))}

      {tracks.length > 0 && <MusicPlayer tracks={tracks} />}
    </div>
  );
}
