'use client';

interface Props {
  percentage: number;
  color: string;
  label: string;
  sublabel?: string;
  size?: number;
}

export default function DonutChart({ percentage, color, label, sublabel, size = 84 }: Props) {
  const pct = Math.max(0, Math.min(100, percentage));
  const innerSize = size - 22;

  return (
    <div className="donut-wrap">
      <div
        className="donut"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${pct * 3.6}deg, #e9edf1 0deg)`,
        }}
      >
        <div className="donut-center" style={{ width: innerSize, height: innerSize }}>
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
