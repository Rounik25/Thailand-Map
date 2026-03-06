import { BarChartDashboard1 } from "./BarChartDashboard1"
import { buildColorMap } from "../../utils/mapColors";

const ANALYSIS_DIMENSION_TO_COLUMN = {
    Entity: "Conglomerate",
    Sector: "Industry",
    "Decarbonization Plan": "Decarbonization Plan",
};

function emissionValueForRow(r, emissionType) {
    const process = Number(r.Process || 0);
    const fuel = Number(r.Fuel || 0);
    const elec = Number(r.Indirect_Electricity || 0);

    switch (emissionType) {
        case "Process":
            return process;
        case "Fuel":
            return fuel;
        case "Indirect_Electricity":
            return elec;
        case "All":
        default:
            return process + fuel + elec;
    }
}

function updateData(rows, emissionType, analysisDimension) {
    const column = ANALYSIS_DIMENSION_TO_COLUMN[analysisDimension] ?? "Conglomerate";

    // Sum emissions by group value
    const totals = new Map();
    for (const r of rows) {
        const key = String(r?.[column] ?? "Unknown").trim() || "Unknown";
        const add = emissionValueForRow(r, emissionType);
        totals.set(key, (totals.get(key) ?? 0) + add);
    }

    // Convert to recharts data and sort (largest first)
    return Array.from(totals.entries())
        .map(([type, value]) => ({ type, value: Number(value.toFixed(2)) }))
        .sort((a, b) => b.value - a.value);
}

export function CardsDashboard1({
    rows,
    emissionType,
    analysisDimension,
    selectedType,
    onSelectType,
}) {
    const data = updateData(rows, emissionType, analysisDimension);
    const { colorByValue, fallbackColor } = buildColorMap(rows, analysisDimension);

    return (
        <div className="h-full">
            <div className="h-8/10 border-1 border-slate-200 rounded-xl shadow-lg">
                <BarChartDashboard1
                    data={data}
                    colorByType={colorByValue}
                    fallbackColor={fallbackColor}
                    selectedType={selectedType}
                    onSelectType={onSelectType}
                />
            </div>
        </div>
    );
}