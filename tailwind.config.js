// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#2E8B57", // Custom Primary Color
                secondary: "#87CEEB", // Custom Secondary Color
                background: "#F5F5F5", // Custom Background Color
                textPrimary: "#333333",
                textSecondary: "#666666",
                warning: "#FF4C4C",
                success: "#32CD32",
            },
        },
    },
    plugins: [],
};
