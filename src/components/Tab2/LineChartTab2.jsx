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

const emissionTrendData = [
  { year: "2019", ptt: 45, nonPtt: 41 },
  { year: "2020", ptt: 38, nonPtt: 55 },
  { year: "2021", ptt: 42, nonPtt: 48 },
  { year: "2022", ptt: 48, nonPtt: 38 },
  { year: "2023", ptt: 55, nonPtt: 45 },
];

export default function LineChartTab2({ data = emissionTrendData }) {
  return (
    <div className="w-full h-full flex flex-col rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 shadow-lg">

      {/* Header */}
      <div className="mb-3">
        <div className="text-sm font-semibold">
          Emission Trend (5 Years)
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300">
          Million Tons CO₂
        </div>
      </div>

      {/* Chart takes remaining space */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="year"
              tick={{ fontSize: 11 }}
            />

            <YAxis
              tick={{ fontSize: 11 }}
              label={{
                value: "Mt CO₂",
                angle: -90,
                position: "outsideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [`${value} Mt`, "Emission"]}
            />

            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: "12px" }}
            />

            <Line
              type="monotone"
              dataKey="ptt"
              name="PTT"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="nonPtt"
              name="Non-PTT"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}