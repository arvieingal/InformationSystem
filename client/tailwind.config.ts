
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': {'min': '320px', 'max': '767px'},
      'md': {'min': '768px', 'max': '1023px'},
      'lg': {'min': '1024px', 'max': '1280px'},
      'xl': {'min': '1281px', 'max': '1535px'},
      '2xl': {'min': '1536px'},
    },
    extend: {
      fontFamily: {
        Poppins: ['Poppins'],
        Lora: ['Lora'],
        Inter: ['Inter'],
      },
      colors: {
        blacktext: '#453D3B',
      }
     
    },
  },

};
export default config;
