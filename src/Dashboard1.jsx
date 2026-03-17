import { CardsDashboard1 } from "./components/Dashboard1/CardsDashboard1"
import MapDashboard1 from "./components/Dashboard1/MapDashboard1"
import { useMemo, useState } from "react"
import { FILTERS_CONFIG_DASHBOARD1 } from "./utils/filterConfigDashboard1"
import { TestFilter1 } from "./components/Dashboard1/TestFilter1"
import { applyFilters } from "./utils/filterUtils"
import Legends from "./components/Dashboard1/Legends"

export function Dashboard1({ dark, rows }) {
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const init = {};
        for (const f of FILTERS_CONFIG_DASHBOARD1) init[f.id] = "All";
        return init;
    });

    const [analysisDimension, setAnalysisDimension] = useState("Entity");

    const [selectedBarType, setSelectedBarType] = useState(null);

    // base rows from normal filters only (exclude analysisDimension + emissionType logic already handled)
    const baseRows = useMemo(
        () => applyFilters(rows, FILTERS_CONFIG_DASHBOARD1, selectedFilters),
        [rows, selectedFilters]
    );

    // map rows: apply bar selection ONLY for the map
    const mapRows = useMemo(() => {
        if (!selectedBarType) return baseRows;

        if (analysisDimension === "Entity") {
            return baseRows.filter(r => String(r.Conglomerate).trim() === selectedBarType);
        }
        if (analysisDimension === "Sector") {
            return baseRows.filter(r => String(r.Industry).trim() === selectedBarType);
        }
        if (analysisDimension === "Decarbonization Plan") {
            return baseRows.filter(r => String(r["Decarbonization Plan"]).trim() === selectedBarType);
        }
        return baseRows;
    }, [baseRows, selectedBarType, analysisDimension]);

    return (
        <div className="w-full h-full min-h-0 min-w-0 bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
            <div className="flex flex-col basis-4/5 min-w-0 min-h-0 p-5 pr-0">
                <div className="w-full h-full min-h-0 min-w-0 bg-white dark:bg-slate-900 rounded-xl shadow-xl flex flex-col overflow-hidden">
                    <div className="w-full shrink-0 pb-5 min-w-0">
                        <Legends
                            rows={baseRows}
                            analysisDimension={analysisDimension}
                            onClickItem={() => { }}
                            showCount={false}
                        />
                    </div>

                    <div className="flex-1 min-h-0 min-w-0 flex gap-5">
                        <div className="basis-1/2 min-w-0 min-h-0">
                            <CardsDashboard1
                                rows={baseRows}
                                emissionType={selectedFilters.emissionType}
                                analysisDimension={analysisDimension}
                                selectedType={selectedBarType}
                                onSelectType={setSelectedBarType}
                                dark={dark}
                            />
                        </div>

                        <div className="basis-1/2 min-w-0 min-h-0">
                            <div className="h-full min-h-0 min-w-0 p-5 pt-0">
                                <MapDashboard1
                                    rows={mapRows}
                                    emissionType={selectedFilters.emissionType}
                                    analysisDimension={analysisDimension}
                                    dark={dark}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="basis-1/5 min-w-0 min-h-0 p-5 overflow-hidden">
                <div className="h-full w-full min-h-0 min-w-0 rounded-xl shadow-xl bg-white dark:bg-slate-900 overflow-auto">
                    <TestFilter1
                        rows={rows}
                        value={selectedFilters}
                        onChange={setSelectedFilters}
                        analysisDimension={analysisDimension}
                        onAnalysisDimensionChange={setAnalysisDimension}
                        dark={dark}
                    />
                </div>
            </div>
        </div>
    );
}