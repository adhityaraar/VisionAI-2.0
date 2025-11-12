export interface IncidentData {
	date: string;
	count: number;
}

export interface ZoneCompliance {
	zone: string;
	complianceRate: number;
}

export const incidentTrends: IncidentData[] = [
	{ date: "Day 1", count: 95 },
	{ date: "Day 2", count: 10 },
	{ date: "Day 3", count: 70 },
	{ date: "Day 4", count: 20 },
	{ date: "Day 5", count: 75 },
];

export const complianceByZone: ZoneCompliance[] = [
	{ zone: "Zone A", complianceRate: 92 },
	{ zone: "Zone B", complianceRate: 85 },
	{ zone: "Zone C", complianceRate: 78 },
	{ zone: "Zone D", complianceRate: 95 },
	{ zone: "Zone E", complianceRate: 88 },
];

export const dashboardStats = {
	totalIncidents: 270,
	complianceRate: 87.6,
	activeZones: 5,
	todayIncidents: 12,
};
