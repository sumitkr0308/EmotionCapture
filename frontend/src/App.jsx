import React, { useState } from "react";

import PhotoEmotionDetectorWithCamera from "./components/PhotoEmotionDetectorWithCamera";
import MusicSuggestions from "./components/MusicSuggestions";
import ExerciseCard from "./components/ExerciseCard";
import { emotionTheme } from "./theme/emotionTheme";

export default function App() {
  const [emotion, setEmotion] = useState("neutral");
  const theme = emotionTheme[emotion] || emotionTheme.neutral;

  return (
    <div
      className={`min-h-screen w-full p-6 sm:p-10 transition-all duration-700 
      bg-gradient-to-br ${theme.background} text-white`}
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide drop-shadow-md">
            Emotion Wellness Dashboard
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Detect emotion → Get curated music → Follow recommended exercises
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT SECTION — Big Emotion Card */}
          <div
            className={`
              md:col-span-2 p-6 sm:p-8 rounded-3xl shadow-xl 
              border border-white/10 bg-white/5 backdrop-blur-xl 
              transition-all ${theme.card}
            `}
          >
            <h1 className={`text-2xl sm:text-3xl font-semibold mb-6 ${theme.text}`}>
              Emotion Capture
            </h1>

            <PhotoEmotionDetectorWithCamera onEmotionDetected={setEmotion} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">

            {/* Music Suggestions */}
            <div
              className={`
                p-6 sm:p-7 rounded-2xl shadow-lg border border-white/10 
                bg-white/5 backdrop-blur-xl transition-all ${theme.card}
              `}
            >
              <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>
                Music Suggestions
              </h2>

              <MusicSuggestions emotion={emotion} />
            </div>

            {/* Exercise Panel */}
            <div
              className={`
                p-6 sm:p-7 rounded-2xl shadow-lg border border-white/10 
                bg-white/5 backdrop-blur-xl transition-all ${theme.card}
              `}
            >
              <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>
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
