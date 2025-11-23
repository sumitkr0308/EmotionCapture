import React, { useState } from "react";

import PhotoEmotionDetectorWithCamera from "./components/PhotoEmotionDetectorWithCamera";
import MusicSuggestions from "./components/MusicSuggestions";
import ExerciseCard from "./components/ExerciseCard";
import { emotionTheme } from "./theme/emotionTheme";

export default function App() {
  const [emotion, setEmotion] = useState("neutral");

  // choose theme based on emotion
  const theme = emotionTheme[emotion] || emotionTheme.neutral;

  return (
    <div
      className={`min-h-screen w-full p-6 transition-all duration-700 bg-gradient-to-br ${theme.background}`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT SECTION — Emotion Detection */}
        <div
          className={`md:col-span-2 p-6 rounded-2xl shadow-xl border ${theme.card}`}
        >
          <h1 className={`text-3xl font-semibold mb-4 ${theme.text}`}>
            Emotion Detection
          </h1>

          <PhotoEmotionDetectorWithCamera onEmotionDetected={setEmotion} />
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">

          {/* Music Suggestions */}
          <div
            className={`p-6 rounded-xl shadow-lg border ${theme.card}`}
          >
            <h2 className={`text-xl font-semibold mb-3 ${theme.text}`}>
              Music Suggestions
            </h2>
            <MusicSuggestions emotion={emotion} />
          </div>

          {/* Exercises */}
          <div
            className={`p-6 rounded-xl shadow-lg border ${theme.card}`}
          >
            <h2 className={`text-xl font-semibold mb-3 ${theme.text}`}>
              Exercises
            </h2>
            <ExerciseCard emotion={emotion} />
          </div>

        </div>
      </div>
    </div>
  );
}
