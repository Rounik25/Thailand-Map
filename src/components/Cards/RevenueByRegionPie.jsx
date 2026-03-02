import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { REGION_COLORS } from "../../utils/getColors";

function formatTHB(v) {
    return (v ?? 0).toLocaleString("en-IN");
}

export default function RevenueByRegionPie({ data }) {
    // data format: [{ name: "Central", value: 12345 }, ...]
    return (
        <div className="h-60 w-60 mt-7 rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="mb-3">
                <div className="text-sm font-semibold">Revenue by Region</div>
                <div className="text-xs text-slate-500 dark:text-slate-300">
                    Share of total sales (THB)
                </div>
            </div>

            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            label={false}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={REGION_COLORS[entry.name] || REGION_COLORS.Unknown}
                                />
                            ))}
                        </Pie>

                        <Tooltip formatter={(value) => [`฿${formatTHB(value)}`, "Revenue"]} />
                        <Legend
                            iconSize={10}
                            wrapperStyle={{
                                fontSize: "12px",
                                paddingTop: "8px"
                            }}
                            formatter={(value) => (
                                <span className="text-xs text-slate-600 dark:text-slate-300">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {(!data || data.length === 0) && (
                <div className="text-sm text-slate-500 dark:text-slate-300">
                    No data for selected filters.
                </div>
            )}
        </div>
    );
}