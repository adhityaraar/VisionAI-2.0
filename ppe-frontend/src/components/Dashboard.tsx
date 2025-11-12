import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
} from "recharts";
import {
	incidentTrends,
	complianceByZone,
	dashboardStats,
} from "@/data/mockData";
import { TrendingUp, AlertTriangle, Shield, Activity } from "lucide-react";

export function Dashboard() {
	return (
		<div className="space-y-6 p-6">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Incidents
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{dashboardStats.totalIncidents}
						</div>
						<p className="text-xs text-muted-foreground">All time</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Compliance Rate
						</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{dashboardStats.complianceRate}%
						</div>
						<p className="text-xs text-muted-foreground">Overall average</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Zones</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{dashboardStats.activeZones}
						</div>
						<p className="text-xs text-muted-foreground">Currently monitored</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Today's Incidents
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{dashboardStats.todayIncidents}
						</div>
						<p className="text-xs text-muted-foreground">Last 24 hours</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Incidents Trends</CardTitle>
						<CardDescription>Incident reports over time</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={incidentTrends}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="hsl(var(--muted))"
								/>
								<XAxis
									dataKey="date"
									stroke="hsl(var(--muted-foreground))"
									style={{ fontSize: "12px" }}
								/>
								<YAxis
									stroke="hsl(var(--muted-foreground))"
									style={{ fontSize: "12px" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
								/>
								<Line
									type="monotone"
									dataKey="count"
									stroke="hsl(var(--primary))"
									strokeWidth={2}
									dot={{ fill: "hsl(var(--primary))", r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Compliance Rates by Zone</CardTitle>
						<CardDescription>
							PPE compliance percentage per zone
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={complianceByZone}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="hsl(var(--muted))"
								/>
								<XAxis
									dataKey="zone"
									stroke="hsl(var(--muted-foreground))"
									style={{ fontSize: "12px" }}
								/>
								<YAxis
									stroke="hsl(var(--muted-foreground))"
									style={{ fontSize: "12px" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
								/>
								<Bar
									dataKey="complianceRate"
									fill="hsl(var(--primary))"
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
