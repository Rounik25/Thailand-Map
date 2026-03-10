import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { year: "2018", Solar: 40, Wind: 24, Hydro: 20 },
  { year: "2019", Solar: 55, Wind: 30, Hydro: 25 },
  { year: "2020", Solar: 70, Wind: 45, Hydro: 35 },
  { year: "2021", Solar: 90, Wind: 60, Hydro: 40 },
  { year: "2022", Solar: 120, Wind: 80, Hydro: 50 },
];

export default function StackedAreaChart2() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="Solar"
          stackId="1"
          stroke="#f59e0b"
          fill="#fbbf24"
        />
        <Area
          type="monotone"
          dataKey="Wind"
          stackId="1"
          stroke="#3b82f6"
          fill="#60a5fa"
        />
        <Area
          type="monotone"
          dataKey="Hydro"
          stackId="1"
          stroke="#10b981"
          fill="#34d399"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}