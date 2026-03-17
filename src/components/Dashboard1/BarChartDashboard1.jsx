import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    LabelList
} from "recharts";

export function BarChartDashboard1({ data, colorByType = {}, fallbackColor = "#64748b", selectedType = null, onSelectType, dark }) {
    const maxValue = Math.max(...data.map((d) => Number(d.value) || 0), 0);
    const paddedMax = maxValue * 1.05;
    const roundedMax = Math.ceil(paddedMax / 5) * 5;

    const ticks = [];
    for (let i = 0; i <= roundedMax; i += 5) {
        ticks.push(i);
    }

    const n = Math.max(data.length, 1);
    const maxBarSize = Math.max(18, Math.min(100, Math.floor(240 / n)));

    const axisColor = dark ? "#ffffff" : "#334155";   // axis + ticks
    const labelColor = dark ? "#ffffff" : "#0f172a";  // axis label
    return (
        <div className="w-full h-full min-h-0 min-w-0 overflow-hidden" style={{ outline: "none" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    barCategoryGap="20%"
                    margin={{ top: 24, right: 16, bottom: n > 6 ? 56 : 28, left: 28 }}
                    tabIndex={-1}
                >
                    <XAxis
                        dataKey="type"
                        tick={false}
                        interval={0}
                        angle={n > 6 ? -20 : 0}
                        textAnchor={n > 6 ? "end" : "middle"}
                        height={n > 6 ? 60 : 30}
                        axisLine={{ stroke: axisColor }}
                        tickLine={{ stroke: labelColor }}
                        padding={{ left: 8, right: 8 }}
                    />

                    <YAxis
                        domain={[0, roundedMax]}
                        ticks={ticks}
                        width={60}
                        tick={{ fontSize: 12, fill: axisColor }}
                        axisLine={{ stroke: axisColor }}
                        tickLine={{ stroke: labelColor }}
                        label={{
                            value: "Estimated Value (Million tons CO2)",
                            angle: -90,
                            position: "insideLeft",
                            dx: -8,
                            style: { textAnchor: "middle", fontSize: 12, fill: axisColor },
                        }}
                    />

                    <Tooltip
                        formatter={(value) => [`${value} Mt CO₂`, "Emission"]}
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    />

                    <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={maxBarSize}
                        activeBar={false}
                        stroke="none"
                        onClick={(barData) => {
                            const clickedType = barData?.payload?.type;
                            if (!clickedType) return;

                            const next = selectedType === clickedType ? null : clickedType;
                            onSelectType?.(next);
                        }}
                    >
                        <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(value) => `${value}`}
                            style={{ fontSize: 12, fontWeight: 600 }}
                        />

                        {data.map((entry, index) => {
                            const isSelected = selectedType === entry.type;
                            const dim = selectedType && !isSelected;

                            return (
                                <Cell
                                    key={index}
                                    stroke="none"
                                    fill={colorByType[entry.type] ?? fallbackColor}
                                    fillOpacity={dim ? 0.25 : 1}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        const next = selectedType === entry.type ? null : entry.type;
                                        onSelectType?.(next);
                                    }}
                                />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}