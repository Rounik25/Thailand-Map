import { useState } from "react";
import { HomePage } from "./HomePage";
import { Navbar } from "./Navbar";
import { Routes, Route } from "react-router-dom";
import { Tab1 } from "./Tab1";
import { Tab2 } from "./Tab2";
import { Tab3 } from "./Tab3";

function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-white">
        <Navbar dark={dark} setDark={setDark} />
        <Routes>
          <Route path="/" element={<HomePage dark={dark} />} />
          <Route path="/tab1" element={<Tab1 dark={dark} />} />
          <Route path="/tab2" element={<Tab2 dark={dark} />} />
          <Route path="/tab3" element={<Tab3 dark={dark} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;