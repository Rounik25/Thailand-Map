import { useState } from "react";
import { HomePage } from "./HomePage";
import { Navbar } from "./Navbar";

function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-white">
        <Navbar dark={dark} setDark={setDark} />
        <HomePage dark={dark} />
      </div>
    </div>
  );
}

export default App;