import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
      },
      boxShadow: {
        custom:
          "rgba(50, 50, 93, 0.25) 0px 12px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
      },
      colors: {
        semiTransparent: "rgba(255, 255, 255, 0.2)",
        pastelBlueGray: "#CED7E4",
        lightGray: "#DEE1E4",
        LightColor: "#FFFFFF",
        buttonBlue: "#546CA1",
        BLUE: "#3F72AF",
        darkLight: "#566E8D",
        darkGreen: "#334B35",
        browny: "#B7AB8D",
        lightBrown: "#d4c9b0",
        darkBrowny: "#675832",
        bg: "#8B5A2B",
        textcolor: "#3B2A1A",
      },
      fontFamily: {
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        rowdies: ["Rowdies", "cursive"],
      },
      backgroundImage: {
        "applicant-bg-1": "url('/Background-1.png')",
        "applicant-bg-2": "url('/Background-2.png')",
        "applicant-bg-3": "url('/Background-3.png')",
        "applicant-nbg-1": "url('/new-bg-sample.png')",
        "applicant-nbg-2": "url('/applicant-nbg.jpg')",
        "applicant-nbg-3": "url('/bgbg.jpg')",
        "applicant-nbg-4": "url('/bgbgbg.jpg')",
        "applicant-nbg-5": "url('/bgbgbgbg.jpg')",
        "applicant-nbg-6": "url('/bgbgbgbgbg.jpg')",
        "sample-logo":"url('/sample-logo.png')",
        "abtusimg":"url('/abtusimg.jpg')",
        "initiallogowhite":"url('/initiallogowhite.jpg')"

      },
      textShadow: {
        default: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        md: "4px 4px 8px rgba(0, 0, 0, 0.4)",
        lg: "6px 6px 12px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "waving-hand": "wave 2s linear infinite",
      },
      variants: {
        backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
        backgroundOpacity: ['responsive', 'hover', 'focus', 'active'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
};
