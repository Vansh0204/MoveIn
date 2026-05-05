import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'brand-gold': '#C8A96E',
        'brand-ink': '#0F0E0C',
        'brand-sand': '#F5F0E8',
        'brand-warm': '#EDE8DC',
        'brand-teal': '#1D6B5A',
        'brand-rust': '#C4603A',
        'brand-verified': '#2D7A4F',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        pill: '40px',
        tag: '8px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        float: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow-gold': '0 0 15px rgba(200, 169, 110, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
