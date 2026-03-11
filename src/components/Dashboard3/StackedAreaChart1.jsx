import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LabelList,
} from "recharts";
import { COLOR_DASHBOARD3 } from "../../utils/Dashboard3/colorsDashboard3";

function TotalTopLabel({ x, y, value }) {
  if (!Number.isFinite(value)) return null;

  return (
    <text
      x={x}
      y={y - 8}
      textAnchor="middle"
      fontSize={12}
      fill="#111827"
    >
      {Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </text>
  );
}

function toNumber(v) {
  if (v == null) return 0;
  const s = String(v).replace(/,/g, "").trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function norm(v) {
  return (v ?? "").toString().trim();
}

function getYear(row) {
  const y = row?.Year ?? row?.year;
  const n = Number(String(y ?? "").trim());
  return Number.isFinite(n) ? n : null;
}

function bucketFromAnalysisDimension(analysisDimension) {
  if (analysisDimension === "Decarbonization Lever") return "Lever 1";
  if (analysisDimension === "Technology") return "Lever 2";
  return "Lever 1";
}

function getStackKey(row, analysisDimension) {
  if (analysisDimension === "Decarbonization Lever") return norm(row?.["Lever 1"]);
  if (analysisDimension === "Technology") return norm(row?.["Lever 2"]);
  return norm(row?.["Lever 1"] ?? row?.["Lever 2"]);
}

function getColor(bucket, key) {
  return COLOR_DASHBOARD3?.[bucket]?.[key] ?? "#64748b";
}


export default function StackedAreaChart1({ rows = [], col }) {
  const analysisDimension = col;

  const { chartData, keys, bucket } = useMemo(() => {
    const bucket = bucketFromAnalysisDimension(analysisDimension);

    // --- 1) Sum Emission Abated by (year, key)
    const byYear = new Map();
    const keySet = new Set();

    for (const r of rows ?? []) {
      const year = getYear(r);
      if (year == null) continue;

      const key = getStackKey(r, analysisDimension);
      if (!key) continue;

      const val = toNumber(
        r?.["Emission Abated Cum"] ?? r?.["Emission Abated"] ?? r?.EmissionAbated ?? r?.emissionAbated
      );

      keySet.add(key);

      if (!byYear.has(year)) byYear.set(year, { year });
      const obj = byYear.get(year);
      obj[key] = (obj[key] ?? 0) + val; 
    }

    // --- 2) Order keys by COLOR_DASHBOARD3 order
    const orderedFromPalette = Object.keys(COLOR_DASHBOARD3?.[bucket] ?? {});
    const paletteIndex = new Map(orderedFromPalette.map((k, i) => [k, i]));

    const keys = Array.from(keySet).sort((a, b) => {
      const ia = paletteIndex.has(a) ? paletteIndex.get(a) : Number.POSITIVE_INFINITY;
      const ib = paletteIndex.has(b) ? paletteIndex.get(b) : Number.POSITIVE_INFINITY;
      if (ia !== ib) return ia - ib;
      if (ia === Number.POSITIVE_INFINITY && ib === Number.POSITIVE_INFINITY) {
        return a.localeCompare(b);
      }
      return 0;
    });

    // --- 3) Build chartData and compute total height for each year
    const chartData = Array.from(byYear.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => {
        let total = 0;
        for (const k of keySet) {
          total += toNumber(v[k]);
        }
        return { ...v, __total: total };
      });

    return { chartData, keys, bucket };
  }, [rows, analysisDimension]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 18, right: 16, bottom: 0, left: 0 }}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />

        {keys.map((k) => {
          const c = getColor(bucket, k);
          return (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              stackId="1"
              stroke={c}
              fill={c}
              isAnimationActive={false}
            />
          );
        })}

        <Line
          type="monotone"
          dataKey="__total"
          stroke="transparent"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        >
          <LabelList dataKey="__total" content={<TotalTopLabel />} />
        </Line>
      </AreaChart>
    </ResponsiveContainer>
  );
}