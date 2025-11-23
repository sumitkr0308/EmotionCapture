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
    setCurrentIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
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
      className={`mt-6 p-5 sm:p-6 rounded-2xl shadow-2xl border border-white/10
      flex flex-col sm:flex-row items-center gap-5 sm:gap-6
      backdrop-blur-xl bg-white/5 transition-all ${theme.card}`}
    >
      {/* Album Art */}
      <img
        src={currentTrack.album_image}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-xl"
        alt=""
      />

      {/* Right Section */}
      <div className="flex-1 w-full">
        <h4 className={`font-semibold text-lg sm:text-xl ${theme.text}`}>
          {currentTrack.name}
        </h4>
        <p className="text-sm text-gray-300 mt-0.5">{currentTrack.artists}</p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden shadow-inner">
          <div
            style={{ width: `${progress}%` }}
            className={`h-full transition-all duration-200 ${theme.button}`}
          ></div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.preview_url}
          onTimeUpdate={handleProgress}
          onEnded={handleNext}
        />
      </div>

      {/* Player Controls */}
      <div className="flex items-center gap-4 sm:gap-5">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-md text-lg"
        >
          ⏮
        </button>

        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-md text-2xl"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-md text-lg"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
