import { TECHNOLOGY_COLORS } from "../../utils/Dashboard2/technologyLineColors";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

function ActiveDot({ cx, cy, tech, color, dimmed, setHoveredTech, setSelectedTech }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={color}
       opacity={dimmed ? 0.15 : 1} 
      stroke={dimmed ? "transparent" : "black"}
      strokeWidth={1}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHoveredTech(tech)}
      onMouseMove={() => setHoveredTech(tech)}
      onMouseLeave={() => setHoveredTech(null)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTech((prev) => (prev === tech ? null : tech));
      }}
    />
  );
}

function CustomTooltip({ active, payload, label, decarbLever, hoveredTech }) {
  if (!active || !payload?.length) return null;

  if (!hoveredTech) return null;

  const item = payload.find((p) => p.dataKey === hoveredTech);
  if (!item) return null;

  const technology = item.dataKey;
  const macc = item.value;
  const year = item.payload?.year ?? label;

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-md text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50">
      <div className="font-semibold mb-1">Details</div>
      <div><span className="font-medium">Decarb Lever:</span> {decarbLever ?? "-"}</div>
      <div><span className="font-medium">Technology:</span> {technology}</div>
      <div><span className="font-medium">Year:</span> {year}</div>
      <div><span className="font-medium">MACC:</span> {Number(macc).toFixed(2)}</div>
    </div>
  );
}

export function LineChartDashboard2({ rows = [], decarbLever = "" }) {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [selectedTech, setSelectedTech] = React.useState(null);

  function resetSelection() {
    setSelectedTech(null);
  }

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
  const maxValue = Math.max(...rows.map((d) => Number(d.MACC) || 0));
  const minValue = Math.min(...rows.map((d) => Number(d.MACC)));
  const roundedMax = Math.ceil(maxValue / 10) * 10;
  const paddedMin = minValue - 20;
  const roundedMin = Math.ceil(paddedMin / 10) * 10;
  console.log(roundedMax)
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
  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 pr-5" onClick={resetSelection}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} onClick={resetSelection}>
          <ReferenceLine
            y={0}
            stroke="#000"
            strokeDasharray="5 5"
          />
          <XAxis
            dataKey="year"
            ldataKey="year"
            type="number"
            domain={[minYear, maxYear + 0.5]}
            ticks={years}
            interval={0}
            tick={{ fontSize: 12 }} 
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
            tick={{fontSize: 12}}
          />
          <Tooltip
            cursor={false}
            content={(props) => (
              <CustomTooltip
                {...props}
                decarbLever={decarbLever}
                hoveredTech={hoveredTech}
              />
            )}
          />

          {technologies.map((tech) => {
            const isSelected = selectedTech === tech;
            const isFiltering = selectedTech != null;
            const dim = isFiltering && !isSelected;

            const color = TECHNOLOGY_COLORS[tech] || "#000000";

            return (
              <Line
                key={tech}
                type="linear"
                dataKey={tech}
                stroke={color}
                strokeWidth={isSelected ? 3 : 2}
                strokeOpacity={dim ? 0.15 : 1}      
                dot={false}
                connectNulls
                isAnimationActive={false}
                onMouseEnter={() => setHoveredTech(tech)}
                onMouseMove={() => setHoveredTech(tech)}
                onMouseLeave={() => setHoveredTech(null)}
                activeDot={(dotProps) => (
                  <ActiveDot
                    {...dotProps}
                    tech={tech}
                    color={color}
                    dimmed={dim}
                    setHoveredTech={setHoveredTech}
                    setSelectedTech={setSelectedTech}
                  />
                )}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}