import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 5173,
		allowedHosts: [
			".a.free.pinggy.link",
			"a.pinggy.link",
			"nzlmdgkspr.a.pinggy.link",
		], // ✅ allow your ngrok hostname
	},
});
