import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function PPEDetection() {
	const [imageSrc, setImageSrc] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const videoFeedUrl = "http://172.20.10.2:5000/video_feed";
		setImageSrc(videoFeedUrl);
	}, []);

	const handleImageLoad = () => {
		setIsLoading(false);
		setError(null);
	};

	const handleImageError = () => {
		setIsLoading(false);
		setError(
			"Failed to load video feed. Make sure the backend server is running.",
		);
	};

	return (
		<div className="space-y-6 p-6">
			{/* Video Feed Card */}
			<Card>
				<CardHeader>
					<CardTitle>PPE Detection</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-muted-foreground">
									Loading video feed...
								</div>
							</div>
						)}
						{error && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-destructive text-center p-4">
									<AlertTriangle className="h-8 w-8 mx-auto mb-2" />
									<p>{error}</p>
								</div>
							</div>
						)}
						<img
							ref={imgRef}
							src={imageSrc}
							alt="Video Feed"
							onLoad={handleImageLoad}
							onError={handleImageError}
							className={`max-w-full max-h-full object-contain ${
								isLoading || error ? "hidden" : ""
							}`}
						/>
					</div>

					{/* Stats Overlay */}
					{/* <div className="mt-4 flex gap-4">
						<div className="flex items-center gap-2">
							<Users className="h-5 w-5 text-primary" />
							<span className="text-sm font-medium">Person:</span>
							<Badge variant="secondary">{stats.personCount}</Badge>
						</div>
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-destructive" />
							<span className="text-sm font-medium">Missing PPE:</span>
							<Badge variant="destructive">{stats.missingPPE}</Badge>
						</div>
					</div> */}
				</CardContent>
			</Card>
		</div>
	);
}
