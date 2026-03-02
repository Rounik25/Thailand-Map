import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function MonthlyConversionChart({ data }) {
  return (
    <div className="mt-10 h-[30vh] rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
      <div className="mb-3">
        <div className="text-sm font-semibold">Monthly Conversion Rate</div>
        <div className="text-xs text-slate-500 dark:text-slate-300">
          Month filter does not affect this chart
        </div>
      </div>

      <div className="h-45 pr-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value) => [`${(value * 100).toFixed(2)}%`, "Conversion"]}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="conversionRate"
              name="Conversion"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}