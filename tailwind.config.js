/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{App,index}.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#9ACBD0',
        'primary-hover': '#88B9BE',
        'background': '#F2EFE7',
      }
    },
  },
  plugins: [],
}
