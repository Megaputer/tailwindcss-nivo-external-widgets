import { nextui } from '@nextui-org/react';

/** @type {import("tailwindcss/types").Config } */
export default {
  content: [
    './src/**/*.{js,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-[#6b6ef8]',
    'bg-[#c654f3]',
    'bg-[#3b94fd]'
  ],
  plugins: [nextui()],
}
