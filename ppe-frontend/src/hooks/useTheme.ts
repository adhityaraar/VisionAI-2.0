import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		// Check localStorage first
		const stored = localStorage.getItem("theme") as Theme | null;
		if (stored) {
			return stored;
		}
		// Check system preference
		if (window.matchMedia("(prefers-color-scheme: light)").matches) {
			return "light";
		}
		return "dark";
	});

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "light") {
			root.classList.add("light");
			root.classList.remove("dark");
		} else {
			root.classList.add("dark");
			root.classList.remove("light");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return { theme, toggleTheme, setTheme };
}

