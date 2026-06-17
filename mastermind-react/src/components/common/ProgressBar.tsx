import {JSX} from "react";

interface ProgressBarProps {
  value: number;
  min: number;
  max: number;
}

export default function ProgressBar({ value, min, max }: ProgressBarProps): JSX.Element {
  const percent = Math.max(0, Math.min(100, ((value - min) * 100) / (max - min)));
  let bgColor = "bg-primary";

  if (percent < 33) {
    bgColor = "bg-danger";
  } else if (percent < 66) {
    bgColor = "bg-warning";
  }

  return (
    <div className="progress">
      <div
        className={`progress-bar ${bgColor}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        style={{ width: `${percent}%` }}
      >
        {value}
      </div>
    </div>
  );
}
