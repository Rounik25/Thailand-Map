import { KPI } from "./KPI"
import { useMemo, useState } from "react";
import { LineChartDashboard2 } from "./LineChartDashboard2"
import { TechnologyLegend } from "./TechnologyLegend";

export function CardsDashboard2({
    rowsD2V1,
    rowsD2V3,
    rowsD2V4_5,
    selectedFilters,
}) {
    const [selectedTech, setSelectedTech] = useState(null);
    const [hoveredTech, setHoveredTech] = useState(null);

    const technologies = useMemo(() => {
        const techSet = new Set();

        for (const r of rowsD2V1 ?? []) {
            const tech = (r?.Technology ?? "").toString().trim();
            const year = r?.Year;
            const macc = r?.MACC;

            if (!tech || year == null || macc == null || Number.isNaN(Number(macc))) {
                continue;
            }

            techSet.add(tech);
        }

        return Array.from(techSet).sort();
    }, [rowsD2V1]);


    return (
        <div className="w-full h-full flex flex-col justify-evenly">
            <div className="w-full h-7/10 bg-white rounded-xl">
                <div className="flex flex-col h-full w-full">
                    <div className="text-xl font-semibold h-10 px-5 flex">
                        <img src="src\assets\chart-line.svg" alt="chart-line logo" className="h-10 px-2 pb-4 pt-1" />
                        MACC Curves
                    </div>
                    <div>
                        <TechnologyLegend
                            technologies={technologies}
                            selectedTech={selectedTech}
                            setSelectedTech={setSelectedTech}
                            hoveredTech={hoveredTech}
                            setHoveredTech={setHoveredTech}
                        />
                    </div>

                    <div className="flex-1 min-h-0 w-full">
                        <LineChartDashboard2
                            rows={rowsD2V1}
                            decarbLever={selectedFilters.decarbLever}
                            selectedTech={selectedTech}
                            setSelectedTech={setSelectedTech}
                            hoveredTech={hoveredTech}
                            setHoveredTech={setHoveredTech}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full h-2/10">
                <KPI rowsD2V3={rowsD2V3} rowsD2V4_5={rowsD2V4_5} />
            </div>
        </div>
    )
}