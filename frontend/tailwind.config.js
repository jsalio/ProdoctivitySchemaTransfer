/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "rgb(239, 246, 255)",
          100: "rgb(219, 234, 254)",
          200: "rgb(191, 219, 254)",
          300: "rgb(147, 197, 253)",
          400: "rgb(96, 165, 250)",
          500: "rgb(59, 130, 246)",
          600: "rgb(37, 99, 235)",
          700: "rgb(29, 78, 216)",
          800: "rgb(30, 64, 175)",
          900: "rgb(30, 58, 138)",
          primary: "rgb(37, 99, 235)"
        },
        neutral: {
          0: "rgb(255, 255, 255)",
          50: "rgb(248, 250, 252)",
          100: "rgb(241, 245, 249)",
          200: "rgb(226, 232, 240)",
          300: "rgb(203, 213, 225)",
          400: "rgb(148, 163, 184)",
          500: "rgb(100, 116, 139)",
          600: "rgb(71, 85, 105)",
          700: "rgb(51, 65, 85)",
          800: "rgb(30, 41, 59)",
          900: "rgb(15, 23, 42)",
          950: "rgb(2, 6, 23)",
          border: "rgb(226, 232, 240)",
          background: "rgb(255, 255, 255)"
        },
        error: {
          50: "rgb(254, 242, 242)",
          100: "rgb(254, 226, 226)",
          200: "rgb(254, 202, 202)",
          300: "rgb(252, 165, 165)",
          400: "rgb(248, 113, 113)",
          500: "rgb(239, 68, 68)",
          600: "rgb(220, 38, 38)",
          700: "rgb(185, 28, 28)",
          800: "rgb(153, 27, 27)",
          900: "rgb(127, 29, 29)"
        },
        warning: {
          50: "rgb(255, 247, 237)",
          100: "rgb(255, 237, 213)",
          200: "rgb(254, 215, 170)",
          300: "rgb(253, 186, 116)",
          400: "rgb(251, 146, 60)",
          500: "rgb(249, 115, 22)",
          600: "rgb(234, 88, 12)",
          700: "rgb(194, 65, 12)",
          800: "rgb(154, 52, 18)",
          900: "rgb(124, 45, 18)"
        },
        success: {
          50: "rgb(240, 253, 244)",
          100: "rgb(220, 252, 231)",
          200: "rgb(187, 247, 208)",
          300: "rgb(134, 239, 172)",
          400: "rgb(74, 222, 128)",
          500: "rgb(34, 197, 94)",
          600: "rgb(22, 163, 74)",
          700: "rgb(21, 128, 61)",
          800: "rgb(22, 101, 52)",
          900: "rgb(20, 83, 45)"
        },
        white: "rgb(255, 255, 255)",
        font: {
          default: "rgb(15, 23, 42)",
          subtext: "rgb(100, 116, 139)",
        }
      },
      fontFamily: {
        caption: ["Saira", "sans-serif"],
        "caption-bold": ["Saira", "sans-serif"],
        body: ["Saira", "sans-serif"],
        "body-bold": ["Saira", "sans-serif"],
        heading3: ["Saira", "sans-serif"],
        heading2: ["Saira", "sans-serif"],
        heading1: ["Saira", "sans-serif"],
        monospace: ["monospace"]
      },
      fontSize: {
        caption: ["12px", { lineHeight: "16px", letterSpacing: "0em", fontWeight: "400" }],
        "caption-bold": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-bold": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "heading-3": ["16px", { lineHeight: "20px", fontWeight: "400" }],
        "heading-2": ["20px", { lineHeight: "24px", fontWeight: "400" }],
        "heading-1": ["30px", { lineHeight: "36px", fontWeight: "400" }],
        "monospace-body": ["14px", { lineHeight: "20px", fontWeight: "400" }]
      },
      boxShadow: {
        sm: "0px 1px 2px 0px rgba(0,0,0,0.05)",
        DEFAULT: "0px 1px 2px 0px rgba(0,0,0,0.05)",
        md: "0px 4px 16px -2px rgba(0,0,0,0.08), 0px 2px 4px -1px rgba(0,0,0,0.08)",
        lg: "0px 12px 32px -4px rgba(0,0,0,0.08), 0px 4px 8px -2px rgba(0,0,0,0.08)",
        overlay: "0px 12px 32px -4px rgba(0,0,0,0.08), 0px 4px 8px -2px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        DEFAULT: "16px",
        lg: "24px",
        full: "9999px"
      },
      spacing: {
        112: "28rem",
        144: "36rem",
        192: "48rem",
        256: "64rem",
        320: "80rem"
      },
      container: {
        center: true,
        padding: "16px",
      },
      screens: {
        mobile: { max: "767px" } // tu @custom-variant mobile
      }
    }
  },
  plugins: []
};
// tailwind.config.js

