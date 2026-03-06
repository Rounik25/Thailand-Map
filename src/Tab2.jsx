import { FilterTab2 } from "./components/Tab2/FilterTab2"
import { CardsTab2 } from "./components/Tab2/CardsTab2"
import MapTab2 from "./components/Tab2/MapTab2"
import { useEffect, useMemo, useState } from "react"
import * as XLSX from "xlsx"
import { FILTERS_CONFIG } from "./utils/filterConfig"

function applyFilters(rows, selected) {
    if (!rows?.length) return [];

    return rows.filter((r) => {
        // Assumption: FILTERS_CONFIG ids match Excel column names.
        // If your config uses a different field name, swap `col = f.key ?? f.id` etc.
        return FILTERS_CONFIG.every((f) => {
            const chosen = selected?.[f.id] ?? "All";
            if (chosen === "All") return true;

            const cell = r?.[f.column];
            // Normalize to string compare (handles numbers/empty)
            return String(cell ?? "").trim() === String(chosen).trim();
        });
    });
}

export function Tab2() {
    const [rows, setRows] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const init = {};
        for (const f of FILTERS_CONFIG) init[f.id] = "All";
        return init;
    });

    const [analysisDimension, setAnalysisDimension] = useState("Entity");

    useEffect(() => {
        let cancelled = false;

        async function loadExcel() {
            // Served from Vite public/: public/data/data.xlsx => /data/data.xlsx
            const res = await fetch("/data/data.xlsx");
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

    // const filteredRows = useMemo(
    //     () => applyFilters(rows, selectedFilters),
    //     [rows, selectedFilters]
    // );

    const [selectedBarType, setSelectedBarType] = useState(null);

    // base rows from normal filters only (exclude analysisDimension + emissionType logic already handled)
    const baseRows = useMemo(
        () => applyFilters(rows, selectedFilters),
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
                <CardsTab2
                    rows={baseRows}
                    emissionType={selectedFilters.emissionType}
                    analysisDimension={analysisDimension}
                    selectedType={selectedBarType}
                    onSelectType={setSelectedBarType}
                />
            </div>

            <div className="w-5/10 h-[100vh] m-10">
                {/* <div className="h-3/20 mt-10 mb-5 flex rounded-xl justify-evenly items-center">
                    <MapRadialChart data={dummy} />
                </div> */}
                <div className="h-16/20 shadow-lg rounded-xl bg-slate-100 flex">
                    <MapTab2
                        rows={mapRows}
                        emissionType={selectedFilters.emissionType}
                        onPointClick={(patch) => {
                            setSelectedFilters((prev) => ({
                                ...prev,
                                ...patch,
                                emissionType: prev.emissionType, // keep whatever user selected
                            }));
                        }}
                        analysisDimension={analysisDimension}
                    />
                </div>
            </div>

            <div className="h-[100vh] w-5/20">
                <div className="h-8/10 w-8/10 max-h-[100%] rounded-xl m-10 border-1 border-slate-200 ">
                    <FilterTab2
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