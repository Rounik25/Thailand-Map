import { CardsDashboard1 } from "./components/Dashboard1/CardsDashboard1"
import MapDashboard1 from "./components/Dashboard1/MapDashboard1"
import { useEffect, useMemo, useState } from "react"
import * as XLSX from "xlsx"
import { FILTERS_CONFIG_DASHBOARD1 } from "./utils/filterConfigDashboard1"
import { TestFilter1 } from "./components/Dashboard1/TestFilter1"
import { applyFilters } from "./utils/filterUtils"

export function Dashboard1({ dark }) {
    const [rows, setRows] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const init = {};
        for (const f of FILTERS_CONFIG_DASHBOARD1) init[f.id] = "All";
        return init;
    });

    const [analysisDimension, setAnalysisDimension] = useState("Entity");

    useEffect(() => {
        let cancelled = false;

        async function loadExcel() {
            const res = await fetch("/data/data.xlsx");
            if (!res.ok) throw new Error(`Failed to load excel: ${res.status}`);

            const buf = await res.arrayBuffer();
            const wb = XLSX.read(buf, { type: "array" });

            const sheetName = "Industries and PP Factbase";
            const ws = wb.Sheets[sheetName];

            if (!ws) {
                throw new Error(`Sheet "${sheetName}" not found in Excel file`);
            }

            const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

            if (!cancelled) setRows(json);
        }

        loadExcel().catch(console.error);

        return () => {
            cancelled = true;
        };
    }, []);

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
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex justify-between">
            <div className="flex flex-col w-8/10 h-full flex p-5 pr-0">
                <div className="h-full w-full bg-white dark:bg-slate-900 border-2 border-slate-300 rounded-xl shadow-xl flex flex-col min-h-0">
                    <div className="font-semibold text-2xl pl-10 py-5">Analytic View</div>
                    <div className="h-20 w-full shrink-0"></div>
                    <div className="flex-1 flex min-h-0 w-full flex">
                        <div className="h-full w-1/2 mr-5 ">
                            <CardsDashboard1
                                rows={baseRows}
                                emissionType={selectedFilters.emissionType}
                                analysisDimension={analysisDimension}
                                selectedType={selectedBarType}
                                onSelectType={setSelectedBarType}
                                dark={dark}
                            />
                        </div>

                        <div className="h-full w-1/2">
                            <div className="h-full flex p-5 pt-0">
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

            <div className="h-full w-2/10 p-5">
                <div className="h-full w-full max-h-[100%] rounded-xl border-2 border-slate-300 shadow-xl bg-white dark:bg-slate-900">
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
    )
}