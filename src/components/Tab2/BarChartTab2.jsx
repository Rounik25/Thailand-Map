import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    LabelList
} from "recharts";

export function BarChartTab2({ data }) {
    const maxValue = Math.max(...data.map(d => d.value));
    const roundedMax = Math.ceil(maxValue / 5) * 5;

    const ticks = [];
    for (let i = 0; i <= roundedMax; i += 5) {
        ticks.push(i);
    }
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    barCategoryGap="35%"
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}

                    <XAxis dataKey="type" />

                    <YAxis
                        domain={[0, roundedMax]}
                        ticks={ticks}
                        label={{
                            value: "Estimated Value (Million tons CO2)",
                            angle: -90,
                            position: "outsideLeft",
                            dx: -10,
                            style: { textAnchor: "middle", fontSize: 12, }
                        }}
                    />

                    <Tooltip
                        formatter={(value) => [`${value} Mt CO₂`, "Emission"]}
                    />

                    <Bar
                        dataKey="value"
                        barSize={150}
                        radius={[6, 6, 0, 0]}
                    >
                        {/* Value on top of bar */}
                        <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(value) => `${value}`}
                            style={{ fontSize: 12, fontWeight: 600 }}
                        />

                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.type === "PTT" ? "#dc2626" : "#385697"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}