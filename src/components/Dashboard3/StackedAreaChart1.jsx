import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  LabelList,
} from "recharts";
import { COLOR_DASHBOARD3 } from "../../utils/Dashboard3/colorsDashboard3";
import { toNumber, getYear, bucketFromAnalysisDimension, getStackKey, getColor } from "../../utils/Dashboard3/mapFunctions";
import { CustomTooltip } from "./CustomToolTip";

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

export default function StackedAreaChart1({ rows = [], col, selectedKey, setSelectedKey }) {
  const analysisDimension = col;
  const [hoveredKey, setHoveredKey] = useState(null);

  const { chartData, keys, bucket, yMax } = useMemo(() => {
    const bucket = bucketFromAnalysisDimension(analysisDimension);

    // --- 1) Sum Emission Abated by (year, key)
    const byYear = new Map();
    const keySet = new Set();

    for (const r of rows ?? []) {
      const year = getYear(r);
      if (year == null) continue;

      const key = getStackKey(r, analysisDimension);
      if (!key) continue;

      keySet.add(key);

      if (!byYear.has(year)) byYear.set(year, { year });
      const obj = byYear.get(year);

      const valCum = toNumber(
        r?.["Emission Abated Cum"] ?? r?.EmissionAbatedCum ?? r?.emissionAbatedCum
      );

      const valEA = toNumber(
        r?.["Emission Abated"] ?? r?.EmissionAbated ?? r?.emissionAbated
      );

      obj[key] = (obj[key] ?? 0) + valCum;

      obj[`__ea__${key}`] = (obj[`__ea__${key}`] ?? 0) + valEA;
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
          const val = toNumber(v[k]);
          v[k] = val;
          const eaKey = `__ea__${k}`;
          v[eaKey] = toNumber(v[eaKey]);
          total += val;
        }
        return { ...v, __total: total };
      });
    const maxTotal = Math.max(
      0,
      ...chartData.map(d => d.__total ?? 0)
    );

    // round UP to next multiple of 5
    const yMax = Math.ceil(maxTotal / 5) * 5;

    return { chartData, keys, bucket, yMax };
  }, [rows, analysisDimension]);

  const handleChartClick = () => {
    // click on empty space => reset
    if (!hoveredKey) {
      setSelectedKey(null);
      return;
    }
    // click on an area => toggle
    setSelectedKey((prev) => (prev === hoveredKey ? null : hoveredKey));
  };

  return (
    <div
      className="w-full h-full"
      onMouseLeave={() => setHoveredKey(null)}
      onBlur={() => setHoveredKey(null)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 18, right: 16, bottom: 15, left: 0 }} onClick={handleChartClick} >
          <XAxis
            dataKey="year"
            interval={0}
            tick={{ fontSize: 12 }}
            tickMargin={6}
            label={{ value: "Year", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            domain={[0, yMax]}
            ticks={Array.from({ length: yMax / 5 + 1 }, (_, i) => i * 5)}
            tick={{ fontSize: 12 }}
            label={{
              value: "Estimated Value (Million tons CO2)",
              angle: -90,
              position: "outsideLeft",
              dx: -10,
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip
            content={
              <CustomTooltip
                analysisDimension={analysisDimension}
                hoveredKey={hoveredKey}
              />
            }
          />

          {keys.map((k) => {
            const c = getColor(bucket, k);
            const dimOthers = selectedKey && selectedKey !== k;
            return (
              <Area
                key={k}
                type="linear"
                dataKey={k}
                stackId="1"
                stroke={c}
                fill={c}
                isAnimationActive={false}
                fillOpacity={dimOthers ? 0.2 : 1}
                strokeOpacity={dimOthers ? 0.2 : 1}
                onMouseEnter={() => setHoveredKey(k)}
                onMouseMove={() => setHoveredKey(k)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{ cursor: "pointer" }}
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
    </div>
  );
}