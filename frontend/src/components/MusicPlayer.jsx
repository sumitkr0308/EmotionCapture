import React, { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ tracks }) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play first track whenever track list updates
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setCurrentIndex(0);
      playTrack(0);
    }
  }, [tracks]);

  const playTrack = (index) => {
    if (!tracks || tracks.length === 0) return;

    const track = tracks[index];
    if (!track?.preview_url) return;

    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create new audio
    const audio = new Audio(track.preview_url);
    audioRef.current = audio;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error("Audio play error:", err));

    setCurrentIndex(index);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex =
      (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
  };

  if (!tracks || tracks.length === 0) return null;

  const currentTrack = tracks[currentIndex];

  return (
    <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-lg">
      {/* Album Cover */}
      {currentTrack.album_image && (
        <img
          src={currentTrack.album_image}
          alt="Album Cover"
          className="w-24 h-24 rounded-lg mb-3 object-cover"
        />
      )}

      {/* Track Info */}
      <h3 className="text-lg font-semibold">{currentTrack.name}</h3>
      <p className="text-gray-400 text-sm">{currentTrack.artists}</p>

      {/* Controls */}
      <div className="mt-4 flex gap-3">
        <button
          className="px-4 py-2 bg-slate-700 rounded"
          onClick={playPrevious}
        >
          Prev
        </button>

        <button
          className="px-4 py-2 bg-indigo-600 rounded"
          onClick={togglePlay}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          className="px-4 py-2 bg-slate-700 rounded"
          onClick={playNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
