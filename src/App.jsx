import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { parseWorkbookToSheets } from "./utils/importData";
import { Routes, Route } from "react-router-dom";
// import { Tab1 } from "./Tab1";
import { Dashboard1 } from "./Dashboard1";
import { Dashboard2 } from "./Dashboard2";
import { Dashboard3 } from "./Dashboard3";
import { HomePage } from "./HomePage";
import * as XLSX from "xlsx"

function App() {
  const [dark, setDark] = useState(false);
  const [rows, setRows] = useState([]);
  const [sheetData, setSheetData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExcel() {
      try {
        const res = await fetch("/data/data.xlsx");
        if (!res.ok) throw new Error(`Failed to load excel: ${res.status}`);

        const buf = await res.arrayBuffer();

        // Parse ALL sheets
        const parsedSheets = parseWorkbookToSheets(buf);

        // Extract specific sheet rows
        const rowsFromSheet =
          parsedSheets["Industries and PP Factbase"] || [];

        if (!cancelled) {
          setSheetData(parsedSheets);
          setRows(rowsFromSheet);
        }
      } catch (err) {
        console.error("Error loading Excel:", err);
      }
    }

    loadExcel();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-white flex flex-col overflow-hidden">
        <div className="sticky top-0 z-[9999] shrink-0">
          <Navbar dark={dark} setDark={setDark} />
        </div>

        <main className="flex-1 min-h-0 min-w-0 overflow-auto dark:bg-slate-950">
          <Routes>
            <Route path="/" element={<HomePage rows={rows} />} />
            <Route path="/dashboard1" element={<Dashboard1 dark={dark} rows={rows} />} />
            <Route path="/dashboard2" element={<Dashboard2 sheetData={sheetData} />} />
            <Route path="/dashboard3" element={<Dashboard3 sheetData={sheetData} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;