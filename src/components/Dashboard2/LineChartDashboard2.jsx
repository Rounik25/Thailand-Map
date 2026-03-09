import { TECHNOLOGY_COLORS } from "../../utils/Dashboard2/technologyLineColors";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

export function LineChartDashboard2({ rows = [] }) {
  const { chartData, technologies } = useMemo(() => {
    // Unique technologies
    const techSet = new Set();
    // year -> object row
    const byYear = new Map();

    for (const r of rows) {
      const tech = (r?.Technology ?? "").toString().trim();
      const year = r?.Year;

      // choose your y-value column here:
      const y = r?.MACC;

      if (!tech || year == null || y == null || Number.isNaN(Number(y))) continue;

      techSet.add(tech);

      if (!byYear.has(year)) byYear.set(year, { year });
      byYear.get(year)[tech] = Number(y); // each tech becomes a series key
    }

    const technologies = Array.from(techSet).sort();

    // convert map to array sorted by year
    const chartData = Array.from(byYear.values()).sort(
      (a, b) => Number(a.year) - Number(b.year)
    );

    return { chartData, technologies };
  }, [rows]);

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 p-5 shadow-lg border-2 border-slate-300 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <ReferenceLine
            y={0}
            stroke="#000"
            strokeDasharray="5 5"
          />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />

          {technologies.map((tech) => (
            <Line
              key={tech}
              type="linear"
              dataKey={tech}
              stroke={TECHNOLOGY_COLORS[tech] || "#000000"}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}