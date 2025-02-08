/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  theme: {
    extend: {
      colors: {
        yellow: "#F7B801",
        gray: "#212529",
      },
    },
  },
  //   plugins: [require("daisyui")],
};
