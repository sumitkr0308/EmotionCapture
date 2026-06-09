import React from "react";
import { emotionTheme } from "../theme/emotionTheme";
import { getAutoTextColor } from "../utils/getTextContrast";

const wellnessMap = {
  happy: {
    label: "Keep the energy bright",
    videos: [
      {
        title: "Feel-Good Bollywood Playlist",
        query: "feel good bollywood playlist",
      },
      {
        title: "Sunshine Lo-fi Mix",
        query: "sunshine lofi beats",
      },
      {
        title: "Dance Break Video",
        query: "fun dance break workout",
      },
    ],
    activities: [
      "Dance to one upbeat song",
      "Take a 10-minute walk in sunlight",
      "Stretch shoulders and neck for 2 minutes",
    ],
  },
  sad: {
    label: "Soft reset for low energy",
    videos: [
      {
        title: "Calm Hindi Lo-fi",
        query: "calm hindi lofi music",
      },
      {
        title: "Rainy Window Study Music",
        query: "rain sounds study music",
      },
      {
        title: "Gentle Breathing Video",
        query: "guided breathing relaxation",
      },
    ],
    activities: [
      "Drink a glass of water slowly",
      "Write down 3 things you can control today",
      "Sit near a window for 5 minutes",
    ],
  },
  angry: {
    label: "Cool down the intensity",
    videos: [
      {
        title: "Box Breathing Guide",
        query: "box breathing exercise",
      },
      {
        title: "Calm Down Music",
        query: "calm down music meditation",
      },
      {
        title: "Short Walk Reset",
        query: "short walk reset motivation",
      },
    ],
    activities: [
      "Do 5 deep breaths, slowly",
      "Take a quick walk and unclench your jaw",
      "Wash your face with cool water",
    ],
  },
  fearful: {
    label: "Gentle grounding",
    videos: [
      {
        title: "Grounding 5-4-3-2-1",
        query: "grounding 54321 exercise",
      },
      {
        title: "Soft Ambient Focus",
        query: "soft ambient music",
      },
      {
        title: "Safe Space Visualization",
        query: "guided visualization relaxation",
      },
    ],
    activities: [
      "Name 5 things you can see right now",
      "Press both feet into the floor for 30 seconds",
      "Hold a cold drink and notice the temperature",
    ],
  },
  neutral: {
    label: "Light balance and clarity",
    videos: [
      {
        title: "Lo-fi Focus Session",
        query: "lofi focus music",
      },
      {
        title: "Desk Stretch Routine",
        query: "desk stretch routine",
      },
      {
        title: "Mindful Morning Walk",
        query: "mindful walking meditation",
      },
    ],
    activities: [
      "Do a 3-minute posture reset",
      "Organize one small part of your desk",
      "Take a slow walk without your phone",
    ],
  },
};

export default function MoodWellnessPanel({ emotion }) {
  const theme = emotionTheme[emotion] || emotionTheme.neutral;
  const textColor =
    theme.text === "auto" ? getAutoTextColor(theme.background) : theme.text;
  const isBrightTheme = ["yellow", "orange", "pink", "amber", "lime"].some(
    (color) => theme.background.includes(color),
  );
  const mutedTextColor = isBrightTheme ? "text-gray-800/80" : "text-white/80";
  const subtleTextColor = isBrightTheme ? "text-gray-700/75" : "text-white/70";

  const wellness = wellnessMap[emotion] || wellnessMap.neutral;

  return (
    <div className="space-y-5 max-h-[66vh] overflow-y-auto pr-2 wellness-scroll">
      <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className={`text-lg sm:text-xl font-bold ${textColor}`}>
              Mood Light Videos
            </h3>
            <p className={`text-sm ${mutedTextColor}`}>{wellness.label}</p>
          </div>
          <div
            className={`text-xs px-3 py-1 rounded-full ${theme.card} ${textColor}`}
          >
            YouTube picks
          </div>
        </div>

        <div className="grid gap-3">
          {wellness.videos.map((video) => {
            const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(video.query)}`;

            return (
              <a
                key={video.title}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl bg-white/10 border border-white/10 p-3.5 hover:bg-white/20 transition-all"
              >
                <div>
                  <h4 className={`font-semibold ${textColor}`}>
                    {video.title}
                  </h4>
                  <p className={`text-xs ${subtleTextColor}`}>
                    Tap to open a curated YouTube search
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${isBrightTheme ? "text-gray-900" : "text-white/90"} group-hover:translate-x-1 transition-transform`}
                >
                  Open
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-4 sm:p-5">
        <h3 className={`text-lg sm:text-xl font-bold mb-4 ${textColor}`}>
          Light Activities
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {wellness.activities.map((activity, index) => (
            <div
              key={index}
              className={`rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm sm:text-base leading-snug ${textColor}`}
            >
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
