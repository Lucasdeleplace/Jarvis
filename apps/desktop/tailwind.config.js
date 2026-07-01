import preset from "@jarvis/ui-kit/preset";

/** @type {import("tailwindcss").Config} */
export default {
  presets: [preset],
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{ts,tsx}",
    "../../packages/ui-kit/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
