import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import "./index.css";

// Initialize theme before rendering
const initializeTheme = () => {
	const stored = localStorage.getItem("theme");
	const prefersLight = window.matchMedia(
		"(prefers-color-scheme: light)",
	).matches;
	const theme = stored || (prefersLight ? "light" : "dark");

	const root = document.documentElement;
	if (theme === "light") {
		root.classList.add("light");
		root.classList.remove("dark");
	} else {
		root.classList.add("dark");
		root.classList.remove("light");
	}
};

initializeTheme();

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
