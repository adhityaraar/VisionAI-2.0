import { createRoute } from "@tanstack/react-router";
import { __rootRoute } from "./__root";
import { PPEDetection } from "@/components/PPEDetection";

export const detectionRoute = createRoute({
	getParentRoute: () => __rootRoute,
	path: "/detection",
	component: () => <PPEDetection />,
});
