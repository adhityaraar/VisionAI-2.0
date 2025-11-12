import { useState, useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
} from "recharts";
import {
	complianceByZone,
	complianceData,
	filterComplianceDataByDate,
	processComplianceData,
	calculateStatsFromData,
	type DateFilterType,
	type DateRange,
} from "@/data/mockData";
import {
	TrendingUp,
	AlertTriangle,
	Shield,
	Activity,
	Calendar,
	MapPin,
	Video,
} from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Camera data - Jakarta Pusat locations
interface Camera {
	id: number;
	name: string;
	position: [number, number]; // [latitude, longitude]
	status: "active" | "inactive";
	zone: string;
}

const cameras: Camera[] = [
	{
		id: 1,
		name: "Camera 1 - Menteng",
		position: [-6.1951, 106.8451], // Menteng, Jakarta Pusat
		status: "active",
		zone: "Logi Warehouse Menteng",
	},
	{
		id: 2,
		name: "Camera 2 - Tanah Abang",
		position: [-6.1875, 106.8142], // Tanah Abang, Jakarta Pusat
		status: "inactive",
		zone: "Logi Warehouse Tanah Abang",
	},
];

export function Dashboard() {
	const [filterType, setFilterType] = useState<DateFilterType>("today");
	const [customRange, setCustomRange] = useState<DateRange>({
		startDate: null,
		endDate: null,
	});

	// Filter data based on selected filter
	const filteredData = useMemo(() => {
		return filterComplianceDataByDate(complianceData, filterType, customRange);
	}, [filterType, customRange]);

	// Calculate stats from filtered data
	const stats = useMemo(() => {
		return calculateStatsFromData(filteredData);
	}, [filteredData]);

	// Process compliance by risk from filtered data
	const complianceByRisk = useMemo(() => {
		return processComplianceData(filteredData);
	}, [filteredData]);

	// Generate incident trends from filtered data
	const incidentTrendsData = useMemo(() => {
		// Group data by date
		const groupedByDate = filteredData.reduce(
			(acc, record) => {
				const date = new Date(record.timestamp).toISOString().split("T")[0];
				if (!acc[date]) {
					acc[date] = 0;
				}
				acc[date] += record.person_count;
				return acc;
			},
			{} as Record<string, number>,
		);

		// Convert to array and sort by date
		return Object.entries(groupedByDate)
			.map(([dateStr, count]) => ({
				date: new Date(dateStr).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "short",
				}),
				count,
				dateValue: new Date(dateStr).getTime(),
			}))
			.sort((a, b) => a.dateValue - b.dateValue)
			.map(({ date, count }) => ({ date, count }));
	}, [filteredData]);

	// Generate compliance by risk level trends from filtered data
	const complianceRiskTrendsData = useMemo(() => {
		// Group data by date and calculate risk levels
		const groupedByDate = filteredData.reduce(
			(acc, record) => {
				const date = new Date(record.timestamp).toISOString().split("T")[0];
				if (!acc[date]) {
					acc[date] = {
						low: 0,
						med: 0,
						high: 0,
						safety: 0,
					};
				}
				acc[date].low += record.compliance_low;
				acc[date].med += record.compliance_med;
				acc[date].high += record.compliance_high;
				const safety = Math.max(
					0,
					record.person_count -
						(record.compliance_low +
							record.compliance_med +
							record.compliance_high),
				);
				acc[date].safety += safety;
				return acc;
			},
			{} as Record<
				string,
				{ low: number; med: number; high: number; safety: number }
			>,
		);

		// Convert to array and sort by date
		return Object.entries(groupedByDate)
			.map(([dateStr, risks]) => ({
				date: new Date(dateStr).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "short",
				}),
				"Low Risk": risks.low,
				"Medium Risk": risks.med,
				"High Risk": risks.high,
				Safety: risks.safety,
				dateValue: new Date(dateStr).getTime(),
			}))
			.sort((a, b) => a.dateValue - b.dateValue)
			.map(
				({
					date,
					"Low Risk": low,
					"Medium Risk": med,
					"High Risk": high,
					Safety: safety,
				}) => ({
					date,
					"Low Risk": low,
					"Medium Risk": med,
					"High Risk": high,
					Safety: safety,
				}),
			);
	}, [filteredData]);

	// Format date for input
	const formatDateForInput = (date: Date | null): string => {
		if (!date) return "";
		return date.toISOString().split("T")[0];
	};

	// Handle custom date change
	const handleCustomDateChange = (type: "start" | "end", value: string) => {
		const date = value ? new Date(value) : null;
		if (date) {
			if (type === "start") {
				date.setHours(0, 0, 0, 0);
			} else {
				date.setHours(23, 59, 59, 999);
			}
		}

		setCustomRange((prev) => ({
			...prev,
			[type === "start" ? "startDate" : "endDate"]: date,
		}));

		if (date) {
			setFilterType("custom");
		}
	};

	return (
		<div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
			{/* Filter Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Filter Data
					</CardTitle>
					<CardDescription>
						Pilih periode waktu untuk melihat data compliance
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						{/* Filter Buttons */}
						<div className="flex flex-wrap gap-2">
							<Button
								variant={filterType === "today" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType("today")}
							>
								Hari Ini
							</Button>
							<Button
								variant={filterType === "thisWeek" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType("thisWeek")}
							>
								Minggu Ini
							</Button>
							<Button
								variant={filterType === "custom" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType("custom")}
							>
								Custom
							</Button>
						</div>

						{/* Custom Date Range Inputs */}
						{filterType === "custom" && (
							<div className="flex flex-wrap gap-4">
								<div className="flex flex-col gap-2">
									<label htmlFor="start-date" className="text-sm font-medium">
										Tanggal Mulai
									</label>
									<input
										id="start-date"
										type="date"
										value={formatDateForInput(customRange.startDate)}
										onChange={(e) =>
											handleCustomDateChange("start", e.target.value)
										}
										className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
									/>
								</div>
								<div className="flex flex-col gap-2">
									<label htmlFor="end-date" className="text-sm font-medium">
										Tanggal Akhir
									</label>
									<input
										id="end-date"
										type="date"
										value={formatDateForInput(customRange.endDate)}
										onChange={(e) =>
											handleCustomDateChange("end", e.target.value)
										}
										className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
									/>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Active Cameras Map */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Video className="h-5 w-5" />
						Active Camera
					</CardTitle>
					<CardDescription>
						Status operasional kamera PPE Detection
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Camera Status Summary */}
						<div className="flex flex-wrap gap-4">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-green-500" />
								<span className="text-sm">
									Active: {cameras.filter((c) => c.status === "active").length}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-red-500" />
								<span className="text-sm">
									Inactive:{" "}
									{cameras.filter((c) => c.status === "inactive").length}
								</span>
							</div>
						</div>

						{/* Map */}
						<div className="h-[400px] w-full rounded-lg overflow-hidden border border-border">
							<MapContainer
								center={[-6.1913, 106.8296]} // Center of Jakarta Pusat
								zoom={13}
								style={{ height: "100%", width: "100%" }}
								scrollWheelZoom={false}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								{cameras.map((camera) => (
									<CircleMarker
										key={camera.id}
										center={camera.position}
										radius={15}
										pathOptions={{
											fillColor:
												camera.status === "active" ? "#22c55e" : "#ef4444",
											fillOpacity: 0.8,
											color: camera.status === "active" ? "#16a34a" : "#dc2626",
											weight: 2,
										}}
									>
										<Popup>
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													<strong>{camera.name}</strong>
												</div>
												<p className="text-sm">Zone: {camera.zone}</p>
												<p className="text-sm">
													Status:{" "}
													<span
														className={
															camera.status === "active"
																? "text-green-600 font-medium"
																: "text-red-600 font-medium"
														}
													>
														{camera.status === "active" ? "Active" : "Inactive"}
													</span>
												</p>
											</div>
										</Popup>
									</CircleMarker>
								))}
							</MapContainer>
						</div>

						{/* Camera List */}
						<div className="grid gap-2 sm:grid-cols-2">
							{cameras.map((camera) => (
								<div
									key={camera.id}
									className="flex items-center justify-between rounded-lg border border-border p-3"
								>
									<div className="flex items-center gap-3">
										<div
											className={`h-2 w-2 rounded-full ${
												camera.status === "active"
													? "bg-green-500"
													: "bg-red-500"
											}`}
										/>
										<div>
											<p className="text-sm font-medium">{camera.name}</p>
											<p className="text-xs text-muted-foreground">
												{camera.zone}
											</p>
										</div>
									</div>
									<span
										className={`text-xs font-medium ${
											camera.status === "active"
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{camera.status === "active" ? "Active" : "Inactive"}
									</span>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

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
						<div className="text-2xl font-bold">{stats.totalIncidents}</div>
						<p className="text-xs text-muted-foreground">
							{filterType === "today"
								? "Hari ini"
								: filterType === "thisWeek"
									? "Minggu ini"
									: "Periode terpilih"}
						</p>
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
						<div className="text-2xl font-bold">{stats.complianceRate}%</div>
						<p className="text-xs text-muted-foreground">
							Rata-rata compliance
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orang</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{filteredData.reduce(
								(sum, record) => sum + record.person_count,
								0,
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							Jumlah orang terdeteksi
						</p>
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
						<div className="text-2xl font-bold">{stats.todayIncidents}</div>
						<p className="text-xs text-muted-foreground">Insiden hari ini</p>
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
							<LineChart data={incidentTrendsData}>
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

			{/* Compliance by Risk Level Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Compliance by Risk Level</CardTitle>
						<CardDescription>
							Jumlah compliance berdasarkan kategori risiko
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={complianceByRisk}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="hsl(var(--muted))"
								/>
								<XAxis
									dataKey="riskLevel"
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
									dataKey="count"
									fill="hsl(var(--primary))"
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Risk Level Trends</CardTitle>
						<CardDescription>
							Tren compliance berdasarkan kategori risiko dari waktu ke waktu
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={complianceRiskTrendsData}>
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
								<Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
								<Line
									type="monotone"
									dataKey="Low Risk"
									stroke="#eab308"
									strokeWidth={2}
									dot={{ fill: "#eab308", r: 3 }}
								/>
								<Line
									type="monotone"
									dataKey="Medium Risk"
									stroke="#f97316"
									strokeWidth={2}
									dot={{ fill: "#f97316", r: 3 }}
								/>
								<Line
									type="monotone"
									dataKey="High Risk"
									stroke="#ef4444"
									strokeWidth={2}
									dot={{ fill: "#ef4444", r: 3 }}
								/>
								<Line
									type="monotone"
									dataKey="Safety"
									stroke="#22c55e"
									strokeWidth={2}
									dot={{ fill: "#22c55e", r: 3 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
