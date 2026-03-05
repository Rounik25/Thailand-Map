import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

function pct(n) {
  return `${Math.round(n)}%`;
}

export default function RegionRadial({ title, pttPct, nonPttPct }) {
  // Ensure they sum to 100 (optional safety)
  const total = (pttPct ?? 0) + (nonPttPct ?? 0);
  const ptt = total ? (pttPct / total) * 100 : 0;
  const non = 100 - ptt;

  const data = [
    { name: "PTT", value: ptt, fill: "#dc2626" },
    { name: "Non-PTT", value: non, fill: "#2563eb" },
  ];

  return (
    <div className="w-full h-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 flex flex-col">
      <div className="mb-2">
        <div className="text-xs font-semibold">{title}</div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip formatter={(v, name) => [pct(v), name]} />

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              label={false}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Pie>

            {/* Center label */}
            
            
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Optional: tiny legend row (instead of Recharts Legend) */}
      <div className="mt-2 flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-2 mr-2">
          <span className="inline-block h-2 w-2 rounded-sm bg-blue-600" />
          Non-PTT {pct(non)}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-sm bg-red-600" />
          PTT {pct(ptt)}
        </span>
      </div>
    </div>
  );
}