import { useState } from "react";
import { HomePage } from "./HomePage";
import { Navbar } from "./Navbar";
import { Routes, Route } from "react-router-dom";
// import { Tab1 } from "./Tab1";
import { Dashboard1 } from "./Dashboard1";
import { Dashboard2 } from "./Dashboard2";
import { Dashboard3 } from "./Dashboard3";

function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="h-screen bg-white text-black dark:bg-slate-950 dark:text-white flex flex-col">
        <Navbar dark={dark} setDark={setDark} />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage dark={dark} />} />
            {/* <Route path="/dashboard1" element={<Tab1 />} /> */}
            <Route path="/dashboard1" element={<Dashboard1 />} />
            <Route path="/dashboard2" element={<Dashboard2 dark={dark} />} />
            <Route path="/dashboard3" element={<Dashboard3 dark={dark} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;