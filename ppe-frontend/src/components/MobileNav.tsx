import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { navigation } from "./const";

export function MobileNav() {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden">
			<div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
				{navigation.map((item) => {
					const isActive = currentPath === item.href;
					return (
						<Link
							key={item.name}
							to={item.href}
							className={cn(
								"flex flex-1 flex-col items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors",
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<item.icon
								className={cn(
									"h-5 w-5",
									isActive ? "text-primary" : "text-muted-foreground",
								)}
							/>
							<span className="truncate">{item.name}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
