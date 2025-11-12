import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Camera, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import visionAiLogo from "@/assets/vision-ai-logo.png";

const navigation = [
	{ name: "Dashboard", href: "/", icon: LayoutDashboard },
	{ name: "PPE Detection", href: "/detection", icon: Camera },
];

export function Sidebar() {
	const router = useRouterState();
	const currentPath = router.location.pathname;
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="flex h-screen w-64 flex-col bg-card border-r border-border">
			<div className="flex h-16 items-center gap-3 px-6 border-b border-border">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<img src={visionAiLogo} alt="Vision AI Logo" className="h-6 w-6" />
				</div>
				<span className="text-xl font-semibold text-foreground">Vision AI</span>
			</div>
			<nav className="flex-1 space-y-1 px-3 py-4">
				{navigation.map((item) => {
					const isActive = currentPath === item.href;
					return (
						<Link
							key={item.name}
							to={item.href}
							className={cn(
								"group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
							)}
						>
							<item.icon className="h-5 w-5" />
							{item.name}
						</Link>
					);
				})}
			</nav>
			<div className="border-t border-border p-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={toggleTheme}
					className="w-full justify-start gap-3"
				>
					{theme === "dark" ? (
						<>
							<Sun className="h-5 w-5" />
							<span>Light Mode</span>
						</>
					) : (
						<>
							<Moon className="h-5 w-5" />
							<span>Dark Mode</span>
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
