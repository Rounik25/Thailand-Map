import { useState } from "react";
import { DummyDashboard } from "./DummyDashboard";
import { Navbar } from "./Navbar";
import { Routes, Route } from "react-router-dom";
// import { Tab1 } from "./Tab1";
import { Dashboard1 } from "./Dashboard1";
import { Dashboard2 } from "./Dashboard2";
import { Dashboard3 } from "./Dashboard3";
import { HomePage } from "./HomePage";

function App() {
  const [dark, setDark] = useState(false);
  const [rows, setRows] = useState([]);
  return (
    <div className={dark ? "dark" : ""}>
      <div className={`h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-white flex flex-col overflow-auto scrollbar-hide`}>
        <div className="sticky top-0 z-9999">
          <Navbar dark={dark} setDark={setDark} />
        </div>
        <div className="flex-1 dark:bg-slate-950">
          <Routes>
            <Route path="/" element={<HomePage rows={rows} setRows={setRows} />} />
            {/* <Route path="/dashboard1" element={<Tab1 />} /> */}
            <Route path="/dashboard1" element={<Dashboard1 dark={dark} rows={rows} />} />
            <Route path="/dashboard2" element={<Dashboard2 />} />
            <Route path="/dashboard3" element={<Dashboard3 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;