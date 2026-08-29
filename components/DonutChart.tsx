'use client';

interface Props {
  percentage: number; // 0-100
  color: string;
  label: string;
  sublabel?: string;
}

export default function DonutChart({ percentage, color, label, sublabel }: Props) {
  const pct = Math.max(0, Math.min(100, percentage));

  return (
    <div className="donut-wrap">
      <div
        className="donut"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg, #e9edf1 0deg)`,
        }}
      >
        <div className="donut-center">
          <strong>{pct}%</strong>
        </div>
      </div>
      <div className="donut-label">
        <span>{label}</span>
        {sublabel && <p>{sublabel}</p>}
      </div>
    </div>
  );
}
