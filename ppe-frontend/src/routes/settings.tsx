import { createRoute } from "@tanstack/react-router";
import { __rootRoute } from "./__root";
import { Settings } from "@/components/Settings";

export const settingsRoute = createRoute({
	getParentRoute: () => __rootRoute,
	path: "/settings",
	component: () => <Settings />,
});

