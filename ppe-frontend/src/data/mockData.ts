export interface IncidentData {
	date: string;
	count: number;
}

export interface ZoneCompliance {
	zone: string;
	complianceRate: number;
}

export interface ComplianceRiskData {
	riskLevel: string;
	count: number;
}

export interface ComplianceRecord {
	id: number;
	timestamp: string;
	person_count: number;
	compliance_low: number;
	compliance_med: number;
	compliance_high: number;
	safety: number;
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

// CSV data converted to array of objects with varied timestamps
// Note: safety will be calculated in processComplianceData function
// Data distributed across different days and weeks for filter demonstration
export const complianceData: ComplianceRecord[] = [
	// HARI INI (2025-11-12) - 10 records
	{ id: 1, timestamp: "2025-11-12 08:15:30.000000", person_count: 4, compliance_low: 4, compliance_med: 2, compliance_high: 4, safety: 0 },
	{ id: 2, timestamp: "2025-11-12 09:22:15.000000", person_count: 2, compliance_low: 1, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 3, timestamp: "2025-11-12 10:35:45.000000", person_count: 3, compliance_low: 2, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 4, timestamp: "2025-11-12 11:48:20.000000", person_count: 2, compliance_low: 0, compliance_med: 0, compliance_high: 2, safety: 0 },
	{ id: 5, timestamp: "2025-11-12 13:10:55.000000", person_count: 2, compliance_low: 2, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 6, timestamp: "2025-11-12 14:25:10.000000", person_count: 3, compliance_low: 2, compliance_med: 1, compliance_high: 2, safety: 0 },
	{ id: 7, timestamp: "2025-11-12 15:40:30.000000", person_count: 3, compliance_low: 1, compliance_med: 2, compliance_high: 3, safety: 0 },
	{ id: 8, timestamp: "2025-11-12 16:55:45.000000", person_count: 4, compliance_low: 4, compliance_med: 3, compliance_high: 1, safety: 0 },
	{ id: 9, timestamp: "2025-11-12 17:20:12.000000", person_count: 2, compliance_low: 0, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 10, timestamp: "2025-11-12 18:05:35.000000", person_count: 2, compliance_low: 1, compliance_med: 1, compliance_high: 0, safety: 0 },

	// KEMARIN (2025-11-11) - 8 records
	{ id: 11, timestamp: "2025-11-11 08:30:20.000000", person_count: 2, compliance_low: 0, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 12, timestamp: "2025-11-11 10:15:45.000000", person_count: 3, compliance_low: 3, compliance_med: 3, compliance_high: 1, safety: 0 },
	{ id: 13, timestamp: "2025-11-11 11:40:30.000000", person_count: 2, compliance_low: 2, compliance_med: 2, compliance_high: 2, safety: 0 },
	{ id: 14, timestamp: "2025-11-11 13:25:15.000000", person_count: 3, compliance_low: 0, compliance_med: 3, compliance_high: 0, safety: 0 },
	{ id: 15, timestamp: "2025-11-11 14:50:40.000000", person_count: 3, compliance_low: 1, compliance_med: 3, compliance_high: 3, safety: 0 },
	{ id: 16, timestamp: "2025-11-11 16:10:25.000000", person_count: 2, compliance_low: 2, compliance_med: 2, compliance_high: 2, safety: 0 },
	{ id: 17, timestamp: "2025-11-11 17:35:50.000000", person_count: 1, compliance_low: 1, compliance_med: 1, compliance_high: 1, safety: 0 },
	{ id: 18, timestamp: "2025-11-11 18:20:10.000000", person_count: 2, compliance_low: 0, compliance_med: 2, compliance_high: 1, safety: 0 },

	// MINGGU INI - Hari lain (2025-11-10, 09, 08) - 12 records
	{ id: 19, timestamp: "2025-11-10 09:10:30.000000", person_count: 2, compliance_low: 2, compliance_med: 1, compliance_high: 2, safety: 0 },
	{ id: 20, timestamp: "2025-11-10 11:25:45.000000", person_count: 3, compliance_low: 3, compliance_med: 2, compliance_high: 1, safety: 0 },
	{ id: 21, timestamp: "2025-11-10 14:40:20.000000", person_count: 2, compliance_low: 0, compliance_med: 1, compliance_high: 1, safety: 0 },
	{ id: 22, timestamp: "2025-11-10 16:55:35.000000", person_count: 3, compliance_low: 3, compliance_med: 3, compliance_high: 2, safety: 0 },
	
	{ id: 23, timestamp: "2025-11-09 08:45:15.000000", person_count: 4, compliance_low: 3, compliance_med: 2, compliance_high: 3, safety: 0 },
	{ id: 24, timestamp: "2025-11-09 10:20:40.000000", person_count: 4, compliance_low: 0, compliance_med: 1, compliance_high: 1, safety: 0 },
	{ id: 25, timestamp: "2025-11-09 13:35:55.000000", person_count: 0, compliance_low: 0, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 26, timestamp: "2025-11-09 15:50:10.000000", person_count: 3, compliance_low: 1, compliance_med: 3, compliance_high: 2, safety: 0 },
	
	{ id: 27, timestamp: "2025-11-08 09:15:25.000000", person_count: 4, compliance_low: 0, compliance_med: 2, compliance_high: 4, safety: 0 },
	{ id: 28, timestamp: "2025-11-08 11:30:40.000000", person_count: 2, compliance_low: 1, compliance_med: 2, compliance_high: 1, safety: 0 },
	{ id: 29, timestamp: "2025-11-08 14:45:55.000000", person_count: 2, compliance_low: 0, compliance_med: 2, compliance_high: 2, safety: 0 },
	{ id: 30, timestamp: "2025-11-08 17:00:10.000000", person_count: 4, compliance_low: 0, compliance_med: 2, compliance_high: 0, safety: 0 },

	// MINGGU LALU (2025-11-04 to 2025-11-07) - 12 records
	{ id: 31, timestamp: "2025-11-07 08:20:30.000000", person_count: 2, compliance_low: 1, compliance_med: 0, compliance_high: 1, safety: 0 },
	{ id: 32, timestamp: "2025-11-07 10:35:45.000000", person_count: 2, compliance_low: 0, compliance_med: 0, compliance_high: 2, safety: 0 },
	{ id: 33, timestamp: "2025-11-07 13:50:20.000000", person_count: 2, compliance_low: 0, compliance_med: 2, compliance_high: 0, safety: 0 },
	
	{ id: 34, timestamp: "2025-11-06 09:10:15.000000", person_count: 4, compliance_low: 3, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 35, timestamp: "2025-11-06 11:25:30.000000", person_count: 3, compliance_low: 1, compliance_med: 3, compliance_high: 2, safety: 0 },
	{ id: 36, timestamp: "2025-11-06 14:40:45.000000", person_count: 4, compliance_low: 0, compliance_med: 1, compliance_high: 4, safety: 0 },
	
	{ id: 37, timestamp: "2025-11-05 08:55:20.000000", person_count: 1, compliance_low: 1, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 38, timestamp: "2025-11-05 12:10:35.000000", person_count: 3, compliance_low: 0, compliance_med: 2, compliance_high: 3, safety: 0 },
	{ id: 39, timestamp: "2025-11-05 15:25:50.000000", person_count: 4, compliance_low: 3, compliance_med: 0, compliance_high: 3, safety: 0 },
	
	{ id: 40, timestamp: "2025-11-04 09:40:15.000000", person_count: 0, compliance_low: 0, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 41, timestamp: "2025-11-04 13:55:30.000000", person_count: 2, compliance_low: 2, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 42, timestamp: "2025-11-04 16:10:45.000000", person_count: 0, compliance_low: 0, compliance_med: 0, compliance_high: 0, safety: 0 },

	// 2 MINGGU LALU (2025-10-28 to 2025-11-03) - 18 records
	{ id: 43, timestamp: "2025-11-03 10:15:20.000000", person_count: 3, compliance_low: 2, compliance_med: 1, compliance_high: 1, safety: 0 },
	{ id: 44, timestamp: "2025-11-03 14:30:35.000000", person_count: 4, compliance_low: 1, compliance_med: 2, compliance_high: 3, safety: 0 },
	{ id: 45, timestamp: "2025-11-03 16:45:20.000000", person_count: 2, compliance_low: 0, compliance_med: 1, compliance_high: 1, safety: 0 },
	
	{ id: 46, timestamp: "2025-11-02 09:20:15.000000", person_count: 3, compliance_low: 3, compliance_med: 1, compliance_high: 2, safety: 0 },
	{ id: 47, timestamp: "2025-11-02 13:35:30.000000", person_count: 2, compliance_low: 1, compliance_med: 1, compliance_high: 0, safety: 0 },
	{ id: 48, timestamp: "2025-11-02 17:50:45.000000", person_count: 4, compliance_low: 2, compliance_med: 3, compliance_high: 1, safety: 0 },
	
	{ id: 49, timestamp: "2025-11-01 08:15:40.000000", person_count: 1, compliance_low: 1, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 50, timestamp: "2025-11-01 12:30:55.000000", person_count: 3, compliance_low: 0, compliance_med: 2, compliance_high: 2, safety: 0 },
	{ id: 51, timestamp: "2025-11-01 16:45:10.000000", person_count: 2, compliance_low: 2, compliance_med: 0, compliance_high: 1, safety: 0 },
	
	{ id: 52, timestamp: "2025-10-31 10:15:20.000000", person_count: 1, compliance_low: 0, compliance_med: 1, compliance_high: 1, safety: 0 },
	{ id: 53, timestamp: "2025-10-31 14:30:35.000000", person_count: 3, compliance_low: 1, compliance_med: 1, compliance_high: 2, safety: 0 },
	
	{ id: 54, timestamp: "2025-10-30 09:45:50.000000", person_count: 2, compliance_low: 1, compliance_med: 2, compliance_high: 0, safety: 0 },
	{ id: 55, timestamp: "2025-10-30 13:00:15.000000", person_count: 3, compliance_low: 2, compliance_med: 1, compliance_high: 3, safety: 0 },
	
	{ id: 56, timestamp: "2025-10-29 11:20:40.000000", person_count: 2, compliance_low: 0, compliance_med: 0, compliance_high: 0, safety: 0 },
	{ id: 57, timestamp: "2025-10-29 15:35:55.000000", person_count: 4, compliance_low: 3, compliance_med: 2, compliance_high: 1, safety: 0 },
	
	{ id: 58, timestamp: "2025-10-28 10:50:10.000000", person_count: 1, compliance_low: 0, compliance_med: 1, compliance_high: 0, safety: 0 },
	{ id: 59, timestamp: "2025-10-28 14:05:25.000000", person_count: 3, compliance_low: 1, compliance_med: 0, compliance_high: 2, safety: 0 },
	{ id: 60, timestamp: "2025-10-28 17:20:40.000000", person_count: 2, compliance_low: 2, compliance_med: 1, compliance_high: 1, safety: 0 },
];

// Process compliance data to calculate safety and aggregate by risk level
export const processComplianceData = (data: ComplianceRecord[]): ComplianceRiskData[] => {
	// Calculate safety for each record (person_count - sum of all risk categories)
	const processedData = data.map(record => ({
		...record,
		safety: Math.max(0, record.person_count - (record.compliance_low + record.compliance_med + record.compliance_high))
	}));

	// Aggregate by risk level
	const aggregated = processedData.reduce((acc, record) => {
		acc.low += record.compliance_low;
		acc.med += record.compliance_med;
		acc.high += record.compliance_high;
		acc.safety += record.safety;
		return acc;
	}, { low: 0, med: 0, high: 0, safety: 0 });

	return [
		{ riskLevel: "Low Risk", count: aggregated.low },
		{ riskLevel: "Medium Risk", count: aggregated.med },
		{ riskLevel: "High Risk", count: aggregated.high },
		{ riskLevel: "Safety", count: aggregated.safety },
	];
};

export const complianceByRisk: ComplianceRiskData[] = processComplianceData(complianceData);

export const dashboardStats = {
	totalIncidents: 270,
	complianceRate: 87.6,
	activeZones: 5,
	todayIncidents: 12,
};

// Date filter types
export type DateFilterType = "today" | "thisWeek" | "custom";

export interface DateRange {
	startDate: Date | null;
	endDate: Date | null;
}

// Helper functions for date filtering
export const getTodayRange = (): DateRange => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const endOfToday = new Date(today);
	endOfToday.setHours(23, 59, 59, 999);
	return { startDate: today, endDate: endOfToday };
};

export const getThisWeekRange = (): DateRange => {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
	const monday = new Date(today);
	monday.setDate(diff);
	monday.setHours(0, 0, 0, 0);
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);
	return { startDate: monday, endDate: sunday };
};

export const filterComplianceDataByDate = (
	data: ComplianceRecord[],
	filterType: DateFilterType,
	customRange?: DateRange,
): ComplianceRecord[] => {
	let dateRange: DateRange;

	switch (filterType) {
		case "today":
			dateRange = getTodayRange();
			break;
		case "thisWeek":
			dateRange = getThisWeekRange();
			break;
		case "custom":
			dateRange = customRange || { startDate: null, endDate: null };
			break;
		default:
			return data;
	}

	if (!dateRange.startDate || !dateRange.endDate) {
		return data;
	}

	return data.filter((record) => {
		const recordDate = new Date(record.timestamp);
		return (
			recordDate >= dateRange.startDate! &&
			recordDate <= dateRange.endDate!
		);
	});
};

// Function to calculate stats from filtered data
export const calculateStatsFromData = (
	data: ComplianceRecord[],
): {
	totalIncidents: number;
	complianceRate: number;
	todayIncidents: number;
} => {
	if (data.length === 0) {
		return {
			totalIncidents: 0,
			complianceRate: 0,
			todayIncidents: 0,
		};
	}

	const totalPersons = data.reduce((sum, record) => sum + record.person_count, 0);
	const totalCompliant = data.reduce(
		(sum, record) =>
			sum +
			record.compliance_low +
			record.compliance_med +
			record.compliance_high,
		0,
	);

	const complianceRate =
		totalPersons > 0 ? (totalCompliant / totalPersons) * 100 : 0;

	const todayRange = getTodayRange();
	const todayIncidents = data.filter((record) => {
		const recordDate = new Date(record.timestamp);
		return (
			recordDate >= todayRange.startDate! &&
			recordDate <= todayRange.endDate!
		);
	}).length;

	return {
		totalIncidents: data.length,
		complianceRate: Math.round(complianceRate * 10) / 10,
		todayIncidents,
	};
};
