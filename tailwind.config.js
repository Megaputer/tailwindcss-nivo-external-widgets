import { nextui } from '@nextui-org/react';

// @ts-checkimport
// import { fontFamily } from 'tailwindcss/defaultTheme';
// import { colors } from 'tailwindcss/colors';

/** @type {import("tailwindcss/types").Config } */
export default {
  content: [
    './src/**/*.{js,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}', // NextUI theme
  ],
  safelist: [
    'bg-[#6b6ef8]',
    'bg-[#c654f3]',
    'bg-[#3b94fd]'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    prefix: "", // custom prefix for tailwind classes
  })],
}
