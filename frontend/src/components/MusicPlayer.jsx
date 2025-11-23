import React, { useEffect, useRef, useState } from "react";
import { emotionTheme } from "../theme/emotionTheme";

export default function MusicPlayer({ tracks, emotion = "neutral" }) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTrack = tracks[currentIndex];

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const theme = emotionTheme[emotion] || emotionTheme.neutral;

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? tracks.length - 1 : prev - 1
    );
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProgress = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    setProgress((currentTime / duration) * 100);
  };

  return (
    <div
      className={`mt-6 p-4 rounded-xl shadow-2xl border transition-all duration-500 
      flex gap-4 items-center backdrop-blur-lg ${theme.card}`}
    >
      {/* Track Image */}
      <img
        src={currentTrack.album_image}
        className="w-16 h-16 rounded-lg object-cover shadow-lg"
        alt=""
      />

      {/* Track Info + Progress */}
      <div className="flex-1">
        <h4 className={`font-semibold ${theme.text}`}>
          {currentTrack.name}
        </h4>
        <p className="text-sm text-gray-300">
          {currentTrack.artists}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className={`h-full transition-all duration-200 rounded-full ${theme.button}`}
          ></div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.preview_url}
          onTimeUpdate={handleProgress}
          onEnded={handleNext}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center">
        <button
          onClick={handlePrev}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          ⏮
        </button>

        <button
          onClick={togglePlay}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-lg"
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>

        <button
          onClick={handleNext}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
