interface ProgressCircleProps {
  percentage: number;
  size?: "small" | "normal";
}

export default function ProgressCircle({ percentage, size = "normal" }: ProgressCircleProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const dimensions = size === "small" ? "w-20 h-20" : "w-32 h-32";
  const textSize = size === "small" ? "text-lg" : "text-2xl";

  return (
    <div className={`relative ${dimensions}`} data-testid="progress-circle">
      <svg className={dimensions} viewBox="0 0 100 100">
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          stroke="hsl(var(--muted))" 
          strokeWidth="8" 
          fill="none"
        />
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          stroke="url(#gradient)" 
          strokeWidth="8" 
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%"
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`${textSize} font-bold text-primary`} data-testid="progress-percentage">
            {percentage}%
          </div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
      </div>
    </div>
  );
}
