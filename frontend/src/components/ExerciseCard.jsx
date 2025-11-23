import React from "react";

export default function ExerciseCard({ emotion }) {
  const map = {
    happy: ["Dance workout", "Stretching", "Light cardio"],
    sad: ["Yoga", "Deep breathing", "Meditation"],
    angry: ["Running", "Box breathing", "Punching air"],
    fearful: ["Relax stretch", "Slow breathing", "Neck rolls"],
    neutral: ["Walk", "Casual stretch", "Light yoga"],
  };

  const exercises = map[emotion] || map.neutral;

  return (
    <div>
      {exercises.map((e, i) => (
        <div key={i} className="p-3 bg-slate-900 rounded-lg mb-2">
          {e}
        </div>
      ))}
    </div>
  );
}
