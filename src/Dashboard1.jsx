import { CardsDashboard1 } from "./components/Dashboard1/CardsDashboard1"
import MapDashboard1 from "./components/Dashboard1/MapDashboard1"
import { useEffect, useMemo, useState } from "react"
import * as XLSX from "xlsx"
import { FILTERS_CONFIG_DASHBOARD1 } from "./utils/filterConfigDashboard1"
import { TestFilter1 } from "./components/Dashboard1/TestFilter1"
import { applyFilters } from "./utils/filterUtils"

export function Dashboard1() {
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
            // Served from Vite public/: public/data/data.xlsx => /data/data.xlsx
            const res = await fetch("/data/dataTab2.xlsx");
            if (!res.ok) throw new Error(`Failed to load excel: ${res.status}`);

            const buf = await res.arrayBuffer();
            const wb = XLSX.read(buf, { type: "array" });
            const ws = wb.Sheets[wb.SheetNames[0]];
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
        <div className="w-[100%] h-[100vh] bg-white flex justify-between">
            <div className="h-[100%] w-3/10 m-10">
                <CardsDashboard1
                    rows={baseRows}
                    emissionType={selectedFilters.emissionType}
                    analysisDimension={analysisDimension}
                    selectedType={selectedBarType}
                    onSelectType={setSelectedBarType}
                />
            </div>

            <div className="w-5/10 h-[100vh] m-10">
                <div className="h-16/20 shadow-lg rounded-xl bg-slate-100 flex">
                    <MapDashboard1
                        rows={mapRows}
                        emissionType={selectedFilters.emissionType}
                        analysisDimension={analysisDimension}
                    />
                </div>
            </div>

            <div className="h-[100vh] w-5/20">
                <div className="h-8/10 w-8/10 max-h-[100%] rounded-xl m-10 border-2 border-slate-300  shadow-lg">
                    <TestFilter1
                        rows={rows}
                        value={selectedFilters}
                        onChange={setSelectedFilters}
                        analysisDimension={analysisDimension}
                        onAnalysisDimensionChange={setAnalysisDimension}
                    />
                </div>
            </div>
        </div>
    )
}