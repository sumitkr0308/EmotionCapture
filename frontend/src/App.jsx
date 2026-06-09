import React, { useState } from "react";

import PhotoEmotionDetectorWithCamera from "./components/PhotoEmotionDetectorWithCamera";
import MusicSuggestions from "./components/MusicSuggestions";
import MoodWellnessPanel from "./components/MoodWellnessPanel";
import { emotionTheme } from "./theme/emotionTheme";
import { getAutoTextColor } from "./utils/getTextContrast";

export default function App() {
  const [emotion, setEmotion] = useState("neutral");
  const theme = emotionTheme[emotion] || emotionTheme.neutral;

  const titleColor =
    theme.text === "auto" ? getAutoTextColor(theme.background) : theme.text;

  const subtitleColor =
    theme.text === "auto"
      ? `${getAutoTextColor(theme.background)} opacity-80`
      : "text-gray-200 opacity-80";

  return (
    <div
      className={`
        min-h-screen w-full p-4 sm:p-6 lg:p-8 
        transition-all duration-700 
        bg-gradient-to-br ${theme.background}
      `}
    >
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] px-5 py-6 sm:px-7 sm:py-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_35%)] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <img
              src="/logoEC1.png"
              alt="logo"
              className="w-24 sm:w-32 md:w-36 h-auto object-contain drop-shadow-xl"
            />

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                Live emotion-aware wellness
              </div>

              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-lg ${titleColor}`}
              >
                Emotion Wellness Dashboard
              </h1>

              <p
                className={`mt-2 text-sm sm:text-base max-w-2xl ${subtitleColor}`}
              >
                Detect emotion, get music that matches your mood, and follow a
                gentle wellness lane with light videos and small actions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 min-w-[220px]">
              {[
                ["01", "Emotion"],
                ["02", "Music"],
                ["03", "Reset"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white/10 border border-white/10 px-3 py-4 text-center"
                >
                  <div className={`text-xl font-black ${titleColor}`}>
                    {number}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div
          className={`
            grid grid-cols-1 md:grid-cols-3 gap-4
            rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur-2xl
            shadow-[0_14px_44px_rgba(0,0,0,0.16)] p-4 sm:p-5
            ${theme.card}
          `}
        >
          {[
            {
              step: "01",
              title: "Detect emotion",
              description:
                "Use the camera to read your current mood in real time.",
            },
            {
              step: "02",
              title: "Pick music",
              description:
                "Get mood-matched YouTube songs you can play instantly.",
            },
            {
              step: "03",
              title: "Reset gently",
              description:
                "Follow light videos and small activities to feel better.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5"
            >
              <div className={`text-2xl font-black ${titleColor}`}>
                {item.step}
              </div>
              <h3 className={`mt-2 text-lg font-bold ${titleColor}`}>
                {item.title}
              </h3>
              <p className={`mt-2 text-sm ${subtitleColor}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
          {/* LEFT: EMOTION DETECTOR */}
          <div
            className={`
              xl:col-span-7 p-5 sm:p-6 rounded-[2rem] 
              shadow-[0_12px_40px_rgba(0,0,0,0.25)] 
              border border-white/10 bg-white/10 backdrop-blur-2xl 
              hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] 
              transition-all duration-300 ${theme.card}
            `}
          >
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h1
                  className={`
                    text-2xl sm:text-3xl font-black 
                    tracking-tight drop-shadow-lg ${titleColor}
                  `}
                >
                  Emotion Capture
                </h1>
                <p className={`text-sm mt-1 ${subtitleColor}`}>
                  Live camera analysis and personalized wellness suggestions.
                </p>
              </div>

              <div className="hidden md:block text-xs px-3 py-2 rounded-full bg-white/10 border border-white/10 text-white/80">
                Smooth • Calm • Focused
              </div>
            </div>

            <PhotoEmotionDetectorWithCamera onEmotionDetected={setEmotion} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="xl:col-span-5 space-y-8">
            {/* MUSIC CARD */}
            <div
              className={`
                p-5 sm:p-6 rounded-[2rem] 
                shadow-[0_10px_30px_rgba(0,0,0,0.2)] 
                border border-white/10 bg-white/10 backdrop-blur-2xl 
                hover:shadow-[0_14px_38px_rgba(0,0,0,0.28)] 
                transition-all duration-300 ${theme.card}
              `}
            >
              <h2
                className={`text-xl font-bold mb-4 tracking-wide ${titleColor}`}
              >
                Music Suggestions
              </h2>

              <MusicSuggestions emotion={emotion} />
            </div>

            {/* MOOD WELLNESS CARD */}
            <div
              className={`
                p-5 sm:p-6 rounded-[2rem] 
                shadow-[0_10px_30px_rgba(0,0,0,0.2)] 
                border border-white/10 bg-white/10 backdrop-blur-2xl 
                hover:shadow-[0_14px_38px_rgba(0,0,0,0.28)]
                transition-all duration-300 ${theme.card}
              `}
            >
              <h2
                className={`text-xl font-bold mb-4 tracking-wide ${titleColor}`}
              >
                Mood Light Videos & Activities
              </h2>

              <MoodWellnessPanel emotion={emotion} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
