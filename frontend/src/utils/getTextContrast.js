export function getAutoTextColor(backgroundClass) {
  const bright = ["yellow", "orange", "pink", "amber", "lime"];
  const dark = ["blue", "indigo", "red", "purple", "violet", "slate", "gray", "black"];

  if (!backgroundClass) return "text-white";

  if (bright.some(c => backgroundClass.includes(c))) {
    return "text-gray-900"; // dark text for bright bg
  }

  return "text-white"; // white text for dark bg
}
