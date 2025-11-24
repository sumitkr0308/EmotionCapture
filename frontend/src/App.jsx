import React, { useState } from "react";

import PhotoEmotionDetectorWithCamera from "./components/PhotoEmotionDetectorWithCamera";
import MusicSuggestions from "./components/MusicSuggestions";
import ExerciseCard from "./components/ExerciseCard";
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
        min-h-screen w-full p-6 sm:p-10 
        transition-all duration-700 
        bg-gradient-to-br ${theme.background}
      `}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-3 animate-fadeIn">
          <h1
            className={`text-4xl sm:text-5xl font-extrabold tracking-wide drop-shadow-lg ${titleColor}`}
          >
            Emotion Wellness Dashboard
          </h1>

          <p className={`text-sm sm:text-base ${subtitleColor}`}>
            Detect emotion • Personalized music • Mood balancing exercises
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* LEFT: EMOTION DETECTOR */}
          <div
            className={`
                  md:col-span-2 p-6 sm:p-8 rounded-3xl 
                  shadow-[0_12px_40px_rgba(0,0,0,0.25)] 
                  border border-white/10 bg-white/10 backdrop-blur-2xl 
                  hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] 
                  transition-all duration-300 ${theme.card}
                `}
          >
            <div className="w-full flex justify-center mb-2">
              <img
                src="/logoEC1.png"
                alt="logo"
                className="w-32 sm:w-44 md:w-48 h-auto object-contain"
              />
            </div>

            <PhotoEmotionDetectorWithCamera onEmotionDetected={setEmotion} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-10">
            {/* MUSIC */}
            <div
              className={`
                p-6 sm:p-7 rounded-2xl 
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

            {/* EXERCISES */}
            <div
              className={`
                p-6 sm:p-7 rounded-2xl 
                shadow-[0_10px_30px_rgba(0,0,0,0.2)] 
                border border-white/10 bg-white/10 backdrop-blur-2xl 
                hover:shadow-[0_14px_38px_rgba(0,0,0,0.28)]
                transition-all duration-300 ${theme.card}
              `}
            >
              <h2
                className={`text-xl font-bold mb-4 tracking-wide ${titleColor}`}
              >
                Exercises
              </h2>
              <ExerciseCard emotion={emotion} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
