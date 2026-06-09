import React, { useEffect, useMemo, useRef, useState } from "react";
import { emotionTheme } from "../theme/emotionTheme";
import { getAutoTextColor } from "../utils/getTextContrast";

export default function MusicPlayer({
  tracks,
  emotion = "neutral",
  autoPlayKey = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const positionInitializedRef = useRef(false);

  const currentTrack = tracks[currentIndex];

  const theme = emotionTheme[emotion] || emotionTheme.neutral;
  const textColor =
    theme.text === "auto" ? getAutoTextColor(theme.background) : theme.text;

  const panelStyle = useMemo(
    () => ({
      left: `${position.x}px`,
      top: `${position.y}px`,
    }),
    [position],
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [tracks]);

  useEffect(() => {
    if (!tracks.length) return;
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [autoPlayKey, tracks]);

  useEffect(() => {
    if (positionInitializedRef.current || typeof window === "undefined") return;

    const initialX = Math.max(20, window.innerWidth - 420);
    const initialY = Math.max(80, window.innerHeight - 620);
    setPosition({ x: initialX, y: initialY });
    positionInitializedRef.current = true;
  }, []);

  useEffect(() => {
    const handleMove = (event) => {
      if (!dragging) return;

      const nextX = event.clientX - dragOffsetRef.current.x;
      const nextY = event.clientY - dragOffsetRef.current.y;

      const maxX = window.innerWidth - 340;
      const maxY = window.innerHeight - 120;

      setPosition({
        x: Math.min(Math.max(12, nextX), Math.max(12, maxX)),
        y: Math.min(Math.max(12, nextY), Math.max(12, maxY)),
      });
    };

    const handleUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]);

  const handlePointerDown = (event) => {
    event.preventDefault();
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    setDragging(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div
      className="fixed z-[9999] w-[90vw] max-w-[340px] sm:max-w-[360px] p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col gap-3.5 transition-all"
      style={panelStyle}
    >
      <div
        onMouseDown={handlePointerDown}
        className="flex items-center justify-between gap-3 cursor-move select-none rounded-xl bg-white/10 px-3 py-2"
      >
        <div>
          <p className={`text-sm font-semibold ${textColor}`}>Now Playing</p>
          <p className="text-xs text-white/70">Drag this player anywhere</p>
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
          {isPlaying ? "Playing" : "Paused"}
        </div>
      </div>

      {/* Video + Info */}
      <div className="flex flex-col gap-4">
        <img
          src={currentTrack.thumbnail}
          alt="thumbnail"
          className="
            w-full h-40 sm:h-44 
            rounded-xl object-cover
            shadow-[0_6px_20px_rgba(0,0,0,0.3)]
          "
        />

        <div className="flex-1">
          <h4
            className={`
              font-semibold text-base sm:text-lg 
              tracking-wide 
              ${textColor}
            `}
          >
            {currentTrack.title}
          </h4>

          <p className="text-gray-300 text-sm opacity-80">
            {currentTrack.channel}
          </p>
        </div>
      </div>

      {currentTrack.youtubeId && isPlaying ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <iframe
            width="100%"
            height="180"
            src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?rel=0&autoplay=1`}
            title={currentTrack.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-10 text-center">
          <p className={`text-sm sm:text-base ${textColor}`}>
            Click Play to start this video
          </p>
        </div>
      )}

      {/* Controls Inside Card */}
      <div className="flex items-center justify-center gap-3 mt-1">
        <button
          onClick={handlePrev}
          className="
            p-2.5 rounded-full bg-white/10 
            hover:bg-white/20 transition shadow-md 
            text-lg
          "
        >
          ⏮
        </button>

        <button
          onClick={handleTogglePlay}
          className="
            px-4.5 py-2.5 rounded-full bg-[#ff0000] text-white font-semibold
            hover:bg-[#cc0000] transition shadow-md text-sm sm:text-base
          "
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={handleNext}
          className="
            p-2.5 rounded-full bg-white/10 
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
