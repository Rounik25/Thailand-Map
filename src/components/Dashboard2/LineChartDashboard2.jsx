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

      const yYear = Number(year);
      if (!Number.isFinite(yYear)) continue;

      if (!byYear.has(yYear)) byYear.set(yYear, { year: yYear });
      byYear.get(yYear)[tech] = Number(y);
    }

    const technologies = Array.from(techSet).sort();

    // convert map to array sorted by year
    const chartData = Array.from(byYear.values()).sort(
      (a, b) => Number(a.year) - Number(b.year)
    );

    return { chartData, technologies };
  }, [rows]);
  const maxValue = Math.max(...rows.map((d) => Number(d.MACC) || 0), 0);
  const minValue = Math.min(...rows.map((d) => Number(d.MACC) || 0), 0);
  const paddedMax = maxValue + 10;
  const roundedMax = Math.ceil(paddedMax / 10) * 10;
  const paddedMin = minValue > 0 ? 0 : minValue - 10;
  const roundedMin = Math.ceil(paddedMin / 10) * 10;
  const maxYear = Math.max(...rows.map((d) => Number(d.Year)), 2025);
  const minYear = Math.min(...rows.map((d) => Number(d.Year)), 2025);

  const ticks = [];
  for (let i = roundedMin; i <= roundedMax; i += 10) {
    ticks.push(i);
  }
  const years = []
  for (let i = minYear; i <= maxYear; i += 1) {
    years.push(i);
  }
  console.log(years)
  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 py-5 px-5 shadow-lg border-2 border-slate-300 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <ReferenceLine
            y={0}
            stroke="#000"
            strokeDasharray="5 5"
          />
          <XAxis
            dataKey="year"
            ldataKey="year"
            type="number"
            domain={[minYear, maxYear+0.5]}
            ticks={years}
            interval={0}              
            tick={{ fontSize: 15 }}      // optional
            label={{ value: "Year", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{
              value: "MACC",
              position: "insideleft",
              angle: -90,
              offset: -5,
              dx: -10,
            }}
            ticks={ticks}
          />
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