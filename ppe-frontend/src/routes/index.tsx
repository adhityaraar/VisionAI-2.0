import { createRoute } from "@tanstack/react-router";
import { __rootRoute } from "./__root";
import { Dashboard } from "@/components/Dashboard";

export const indexRoute = createRoute({
	getParentRoute: () => __rootRoute,
	path: "/",
	component: () => <Dashboard />,
});
