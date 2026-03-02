import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts";

function formatTHB(v) {
    return (v ?? 0).toLocaleString("en-IN");
}

export default function OrdersVsSalesChart({ data }) {
    return (
        <div className="h-60 w-60 mt-7 rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col shadow-sm">
            <div className="mb-3">
                <div className="text-sm font-semibold">
                    Orders vs Sales Trend
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-300">
                    Orders (bar) and Revenue (line)
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11 }}
                        />

                        {/* Left Axis → Orders */}
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 11 }}
                            width={40}
                        />

                        {/* Right Axis → Sales */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(v) => `฿${(v / 1000000).toFixed(1)}M`}
                            width={40}
                            tick={{ fontSize: 11 }}
                        />

                        <Tooltip
                            offset={20}
                            contentStyle={{
                                fontSize: "11px",
                                padding: "6px 8px",
                                borderRadius: "6px"
                            }}
                            itemStyle={{
                                fontSize: "11px"
                            }}
                            labelStyle={{
                                fontSize: "11px",
                                fontWeight: 500
                            }}
                            formatter={(value, name, item) => {
                                const key = item?.dataKey;
                                if (key === "salesTHB")
                                    return [`฿${formatTHB(value)}`, "Revenue"];
                                return [Number(value).toLocaleString("en-IN"), "Orders"];
                            }}
                        />

                        <Legend
                            iconSize={10}
                            wrapperStyle={{ fontSize: "12px" }}
                        />

                        <Bar
                            yAxisId="left"
                            dataKey="orders"
                            name="Orders"
                            fill="#2563eb"
                            radius={[4, 4, 0, 0]}
                        />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="salesTHB"
                            name="Revenue"
                            stroke="#dc2626"
                            strokeWidth={2}
                            dot={false}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}