import React, { useEffect, useRef, useState } from "react";
import { emotionTheme } from "../theme/emotionTheme";
import { getAutoTextColor } from "../utils/getTextContrast";

export default function MusicPlayer({ tracks, emotion = "neutral" }) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTrack = tracks[currentIndex];

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const theme = emotionTheme[emotion] || emotionTheme.neutral;
  const textColor =
    theme.text === "auto"
      ? getAutoTextColor(theme.background)
      : theme.text;

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
      className="
        mt-5 p-5 sm:p-6 rounded-2xl 
        border border-white/10 
        bg-white/10 backdrop-blur-xl
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        flex flex-col gap-4 transition-all
      "
    >
      {/* Cover + Info */}
      <div className="flex items-center gap-4">
        <img
          src={currentTrack.album_image}
          alt="album"
          className="
            w-16 h-16 sm:w-20 sm:h-20 
            rounded-xl object-cover 
            shadow-[0_6px_20px_rgba(0,0,0,0.3)]
          "
        />

        <div className="flex-1">
          <h4
            className={`
              font-semibold text-lg sm:text-xl 
              tracking-wide 
              ${textColor}
            `}
          >
            {currentTrack.name}
          </h4>

          <p className="text-gray-300 text-sm opacity-80">
            {currentTrack.artists}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden shadow-inner">
            <div
              style={{ width: `${progress}%` }}
              className={`h-full transition-all duration-200 ${theme.button}`}
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.preview_url}
        onTimeUpdate={handleProgress}
        onEnded={handleNext}
      />

      {/* Controls Inside Card */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <button
          onClick={handlePrev}
          className="
            p-3 rounded-full bg-white/10 
            hover:bg-white/20 transition shadow-md 
            text-lg
          "
        >
          ⏮
        </button>

        <button
          onClick={togglePlay}
          className="
            p-4 rounded-full bg-white/10 
            hover:bg-white/20 transition shadow-md 
            text-2xl
          "
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          onClick={handleNext}
          className="
            p-3 rounded-full bg-white/10 
            hover:bg-white/20 transition shadow-md 
            text-lg
          "
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
