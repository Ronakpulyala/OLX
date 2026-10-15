/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#002f34',
          navyLight: '#003e45',
          navyDark: '#001e21',
          teal: '#002f34',
          tealDark: '#001e21',
          cyan: '#00a49f',
          cyanBright: '#23e5db',
          yellow: '#ffce32',
          yellowDark: '#f7b900',
          amber: '#ffce32',
          amberDark: '#f7b900',
          bg: '#f7f8f8',
          border: '#d8dfe0',
          text: '#002f34',
          muted: '#5e7d81',
          footer: '#ebeeef',
        },
      },
    },
  },
  plugins: [],
};

