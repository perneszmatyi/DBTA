const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    500: '#2563EB',  // main
    600: '#1E40AF',  // dark
    700: '#1E3A8A'
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    500: '#6B7280',
    700: '#374151',
    900: '#111827'
  }
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      spacing: {
        'safe-top': '44px',
        'safe-bottom': '34px'
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px'
      }
    }
  },
  plugins: [],
};