/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#b5a174',
                'primary-dark': '#9a8860',
                'primary-light': '#c9b88d',
            },
        },
    },
    plugins: [],
}
