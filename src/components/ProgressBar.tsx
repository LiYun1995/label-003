interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'warning';
  showLabel?: boolean;
}

export default function ProgressBar({
  progress,
  size = 'md',
  color = 'accent',
  showLabel = false,
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    warning: 'bg-warning-500',
  };

  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-500">学习进度</span>
          <span className="text-xs font-medium text-slate-700">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
