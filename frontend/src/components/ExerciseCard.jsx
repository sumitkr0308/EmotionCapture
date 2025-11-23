import React from "react";
import { emotionTheme } from "../theme/emotionTheme";

export default function ExerciseCard({ emotion }) {
  const map = {
    happy: [
      { name: "Dance Workout", desc: "Boost your joyful energy!", icon: "💃" },
      { name: "Stretching", desc: "Loosen up while staying cheerful", icon: "🤸" },
      { name: "Light Cardio", desc: "Keep the happiness flowing!", icon: "🏃" },
    ],

    sad: [
      { name: "Yoga", desc: "Calm your mind and breathe easy", icon: "🧘" },
      { name: "Deep Breathing", desc: "Reset your emotional balance", icon: "🌬️" },
      { name: "Meditation", desc: "Find a peaceful moment", icon: "🕯️" },
    ],

    angry: [
      { name: "Running", desc: "Release tension and burn energy", icon: "🏃‍♂️🔥" },
      { name: "Box Breathing", desc: "Regain control and relax", icon: "📦😮‍💨" },
      { name: "Air Punching", desc: "Let it out safely!", icon: "🥊" },
    ],

    fearful: [
      { name: "Relax Stretch", desc: "Ease your muscles gently", icon: "🧘‍♀️" },
      { name: "Slow Breathing", desc: "Reduce anxiety and calm nerves", icon: "😮‍💨" },
      { name: "Neck Rolls", desc: "Release stress from the body", icon: "🌀" },
    ],

    neutral: [
      { name: "Walk", desc: "Clear your mind with a casual walk", icon: "🚶" },
      { name: "Light Stretch", desc: "Keep your body active", icon: "🤸‍♂️" },
      { name: "Light Yoga", desc: "Stay flexible and relaxed", icon: "🧘‍♂️" },
    ],
  };

  const exercises = map[emotion] || map.neutral;
  const theme = emotionTheme[emotion] || emotionTheme.neutral;

  return (
    <div className="space-y-4">
      {exercises.map((e, i) => (
        <div
          key={i}
          className={`p-5 rounded-2xl bg-white/5 border shadow-2xl backdrop-blur-lg 
          flex items-center gap-5 transition-all duration-300 cursor-pointer
          hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]
          hover:scale-[1.03] ${theme.card}`}
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          {/* Icon */}
          <div className="text-4xl sm:text-5xl drop-shadow-lg">
            {e.icon}
          </div>

          {/* Exercise Info */}
          <div className="flex flex-col">
            <span className={`font-semibold text-lg sm:text-xl ${theme.text}`}>
              {e.name}
            </span>
            <span className="text-gray-300 text-sm sm:text-base leading-snug">
              {e.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
