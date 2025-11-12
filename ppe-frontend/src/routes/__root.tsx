import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export const __rootRoute = createRootRoute({
	component: () => (
		<div className="flex min-h-screen flex-col bg-background md:h-screen md:flex-row">
			<Sidebar />
			<div className="flex flex-1 flex-col">
				<main className="flex-1 overflow-auto pb-20 md:pb-0">
					<Outlet />
				</main>
				<MobileNav />
			</div>
		</div>
	),
});
