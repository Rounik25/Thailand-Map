import { EntityLegend } from "../Dashboard2/EntityLegend"
import { TechnologyLegend } from "../Dashboard2/TechnologyLegend"

export function FinalLegend({selected, setSelected, currentTechOptions, COL1_ID, COL2_ID, col2ToCol1}) {
    return (
        <div className="flex h-full w-full">
            <div className="h-full min-h-0 flex flex-col">
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
        </div>
    )
}