import React, { useState } from "react";

import PhotoEmotionDetectorWithCamera from "./components/PhotoEmotionDetectorWithCamera";
import MusicSuggestions from "./components/MusicSuggestions";
import ExerciseCard from "./components/ExerciseCard";

export default function App() {
  const [emotion, setEmotion] = useState(null);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-2 bg-slate-800/40 p-6 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-semibold mb-4">Emotion Detection</h1>
          <PhotoEmotionDetectorWithCamera onEmotionDetected={setEmotion} />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Music Suggestions</h2>
            <MusicSuggestions emotion={emotion} />
          </div>

          <div className="bg-slate-800/40 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Exercises</h2>
            <ExerciseCard emotion={emotion} />
          </div>
        </div>

      </div>
    </div>
  );
}
