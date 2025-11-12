import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

interface NotificationSettings {
	risk_levels: RiskLevel[];
}

export function Settings() {
	const [notificationSettings, setNotificationSettings] =
		useState<NotificationSettings>({
			risk_levels: ["low", "medium", "high"], // Default semua aktif
		});

	const handleRiskLevelToggle = (riskLevel: RiskLevel) => {
		setNotificationSettings((prev) => {
			const isCurrentlyEnabled = prev.risk_levels.includes(riskLevel);

			if (isCurrentlyEnabled) {
				// Remove risk level
				return {
					risk_levels: prev.risk_levels.filter((level) => level !== riskLevel),
				};
			} else {
				// Add risk level
				return {
					risk_levels: [...prev.risk_levels, riskLevel],
				};
			}
		});
	};

	const isRiskLevelEnabled = (riskLevel: RiskLevel) => {
		return notificationSettings.risk_levels.includes(riskLevel);
	};

	const riskLevelConfig = [
		{
			level: "low" as RiskLevel,
			label: "Low Risk",
			description: "Notifikasi untuk pelanggaran risiko rendah",
			color: "text-yellow-600 dark:text-yellow-400",
			bgColor: "bg-yellow-50 dark:bg-yellow-950",
			borderColor: "border-yellow-200 dark:border-yellow-800",
		},
		{
			level: "medium" as RiskLevel,
			label: "Medium Risk",
			description: "Notifikasi untuk pelanggaran risiko menengah",
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-50 dark:bg-orange-950",
			borderColor: "border-orange-200 dark:border-orange-800",
		},
		{
			level: "high" as RiskLevel,
			label: "High Risk",
			description: "Notifikasi untuk pelanggaran risiko tinggi",
			color: "text-red-600 dark:text-red-400",
			bgColor: "bg-red-50 dark:bg-red-950",
			borderColor: "border-red-200 dark:border-red-800",
		},
	];

	return (
		<div className="space-y-6 p-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Kelola pengaturan aplikasi dan notifikasi
				</p>
			</div>

			{/* Notification Settings Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Notification Settings
					</CardTitle>
					<CardDescription>
						Pilih level risiko mana yang akan mengirimkan notifikasi ketika
						terdeteksi pelanggaran PPE
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{riskLevelConfig.map((config) => {
							const isEnabled = isRiskLevelEnabled(config.level);
							return (
								<div
									key={config.level}
									className={`rounded-lg border-2 p-4 transition-all ${
										isEnabled
											? `${config.borderColor} ${config.bgColor}`
											: "border-border bg-card"
									}`}
								>
									<label
										htmlFor={`risk-${config.level}`}
										className="flex items-start gap-4 cursor-pointer"
									>
										<div className="flex items-center h-6">
											<input
												id={`risk-${config.level}`}
												type="checkbox"
												checked={isEnabled}
												onChange={() => handleRiskLevelToggle(config.level)}
												className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
											/>
										</div>
										<div className="flex-1 space-y-1">
											<div className="flex items-center gap-2">
												<span
													className={`text-base font-semibold ${
														isEnabled ? config.color : "text-foreground"
													}`}
												>
													{config.label}
												</span>
											</div>
											<p
												className={`text-sm ${
													isEnabled
														? "text-foreground/80"
														: "text-muted-foreground"
												}`}
											>
												{config.description}
											</p>
										</div>
									</label>
								</div>
							);
						})}
					</div>

					{/* Info Section */}
					<div className="mt-6 p-4 bg-muted rounded-lg">
						<div className="flex items-start gap-3">
							<Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div className="space-y-1">
								<p className="text-sm font-medium">Status Notifikasi</p>
								<p className="text-sm text-muted-foreground">
									Saat ini Anda akan menerima notifikasi untuk:{" "}
									<span className="font-semibold text-foreground">
										{notificationSettings.risk_levels.length > 0
											? notificationSettings.risk_levels
													.map(
														(level) =>
															riskLevelConfig.find((c) => c.level === level)
																?.label,
													)
													.join(", ")
											: "Tidak ada notifikasi aktif"}
									</span>
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
