import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { year: "2018", value1: 40, value2: 27, value3: -10 },
  { year: "2019", value1: 35, value2: 24, value3: -9 },
  { year: "2020", value1: 30, value2: 21, value3: -8 },
  { year: "2021", value1: 25, value2: 18, value3: -7 },
  { year: "2022", value1: 20, value2: 15, value3: -6 },
];

export function LineChartTab3() {
  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 p-5 shadow-lg border-2 border-slate-300 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="linear"
            dataKey="value1"
            stroke="#2563eb"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="value2"
            stroke="#dc2626"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="value3"
            stroke="#16a34a"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}