import { EntityLegend } from "./EntityLegend";
import { TechnologyLegend } from "./TechnologyLegend";

export function RenderLegend({selected, setSelected, currentTechOptions, COL1_ID, COL2_ID, col2ToCol1}) {
    return (
        <div>
            <div className="text-md font-bold text-red-600 text-center my-1">Legend</div>
            <div className="p-1 text-sm font-semibold">Entity Category</div>
            <EntityLegend />

            <div className="p-1 text-sm font-semibold">Technology</div>
            <TechnologyLegend
                technologies={currentTechOptions.filter((t) => t !== "All")}
                selectedTechnology={selected[COL2_ID] ?? "All"}
                onSelect={(tech) => {
                    const current = selected[COL2_ID] ?? "All";

                    if (current === tech) {
                        setSelected((p) => ({ ...p, [COL2_ID]: "All" }));
                    } else {
                        setSelected((p) => ({
                            ...p,
                            [COL2_ID]: tech,
                            [COL1_ID]: col2ToCol1.get(tech) ?? p[COL1_ID],
                        }));
                    }
                }}
            />
        </div>
    )
}