import { createRouter } from "@tanstack/react-router";
import { __rootRoute } from "./routes/__root";
import { indexRoute } from "./routes/index";
import { detectionRoute } from "./routes/detection";
import { settingsRoute } from "./routes/settings";

// Create the route tree manually
const routeTree = __rootRoute.addChildren([
	indexRoute,
	detectionRoute,
	settingsRoute,
]);

// Create the router instance
export const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
