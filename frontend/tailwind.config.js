/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      "1.95vw": "1.95vw",
      "1.75vh": "1.75vh"
    },
    extend: {},
  },
  plugins: [],
}
