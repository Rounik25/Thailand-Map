import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FILTERS_CONFIG } from "../../utils/filterConfig";
import { buildFilterOptions } from "../../utils/filterUtils";
import { useRef, useEffect } from "react";

function Select({ label, value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div ref={containerRef} className="flex flex-col gap-1 relative w-full">
            <span className="text-sm font-medium text-black dark:text-slate-300">
                {label}
            </span>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="h-8 border-2 border-slate-200 bg-white px-3 text-sm text-left text-black rounded-lg
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            >
                <span className="block truncate">
                    {value || "Select option"}
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full mt-1 w-full border border-slate-200 bg-white rounded-lg shadow-lg z-50
                    dark:border-slate-700 dark:bg-slate-900 max-h-48 overflow-y-auto">
                    
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false); 
                            }}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 
                            dark:hover:bg-slate-800 whitespace-normal break-words"
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// function Select({ label, value, onChange, options }) {
//     return (
//         <label className="flex flex-col gap-1">
//             <span className="text-sm font-medium text-black dark:text-slate-300">
//                 {label}
//             </span>
//             <select
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className={`h-8 border-2 border-slate-200 bg-white px-3 text-sm text-black rounded-lg
//                    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 mb-2`}
//             >
//                 {options.map((opt) => (
//                     <option key={opt} value={opt}>
//                         {opt}
//                     </option>
//                 ))}
//             </select>
//         </label>
//     )
// }

export function FilterTab2({rows}) {
    const [selected, setSelected] = useState(() => {
        // Initialize all filters to "All"
        const init = {};
        for (const f of FILTERS_CONFIG) init[f.id] = "All";
        return init;
    });

    // const [fileName, setFileName] = useState("")

    // async function onFileChange(e) {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     setFileName(file.name)

    //     const buf = await file.arrayBuffer();
    //     const wb = XLSX.read(buf, { type: "array" });
    //     const wsName = wb.SheetNames[0];
    //     const ws = wb.Sheets[wsName];

    //     // Convert to JSON rows; defval keeps missing cells as empty string
    //     const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
    //     setRows(json);

    //     // Reset filters whenever a new file loads
    //     const reset = {};
    //     for (const f of FILTERS_CONFIG) reset[f.id] = "All";
    //     setSelected(reset);
    // }

    const optionsByFilter = () => {
        if (!rows.length) return {};
        return buildFilterOptions(rows, FILTERS_CONFIG);
    }

    return (
        <div className="h-full w-full flex flex-col justify-between rounded-xl p-2">
            <div className="h-8/10 flex-1 flex flex-col justify-evenly bg-white p-2 px-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto scrollbar-hide">
                {/* <div className="text-center text-red-600 font-bold text-lg m-2">Upload Data</div>
                <div className="flex items-center my-2">
                    <label
                        htmlFor="fileUpload"
                        className="shrink-0 cursor-pointer inline-block h-7 px-2 py-1 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700"
                    >
                        Choose File
                    </label>

                    <div className="ml-3 w-[240px] h-7 flex items-center overflow-hidden">
                        <span className="text-sm text-gray-600 truncate w-full ">
                        {fileName || "No file selected"}
                        </span>
                    </div>
                </div> */}

                <div className="text-center text-red-600 font-bold text-lg mt-4">Filter Panel</div>

                {/* <div className="flex items-center justify-between gap-4">

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={onFileChange}
                        className="text-xs hidden"
                        id="fileUpload"
                    />
                </div> */}

                {/* Filters */}
                <div className="flex flex-col mt-2 flex-1 justify-evenly " >
                    {FILTERS_CONFIG.map((f) => (
                        <Select
                            key={f.id}
                            label={f.label}
                            value={selected[f.id] ?? "All"}
                            onChange={(v) => setSelected((p) => ({ ...p, [f.id]: v }))}
                            options={optionsByFilter[f.id] ?? ["All"]}
                        />
                    ))}
                </div>
            </div>

            <div className="p-5">
                <img src="src\assets\logo.svg" alt="Bain Logo" />
            </div>


        </div>
    );
}