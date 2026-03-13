import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export function Navbar({ dark, setDark }) {
  const location = useLocation();
  const linksContainerRef = useRef(null);
  const indicatorRef = useRef(null);

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Emissions Dashboard";
      case "/dashboard1":
        return "Emissions Dashboard (1/3)";
      case "/dashboard2":
        return "Emissions Dashboard (2/3)";
      case "/dashboard3":
        return "Emissions Dashboard (3/3)";
      default:
        return "Dashboard";
    }
  };

  useEffect(() => {
    const container = linksContainerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    const activeLink = container.querySelector(".nav-item-active");
    if (!activeLink) return;

    const { offsetLeft, offsetWidth } = activeLink;

    // Update DOM directly (external system) – no setState
    indicator.style.width = `${offsetWidth}px`;
    indicator.style.transform = `translateX(${offsetLeft}px)`;
  }, [location.pathname]); // run when route changes

  const linkBase =
    "px-2 py-1 font-semibold text-md dark:text-slate-200";

  return (
    <div className="h-15 min-h-15 px-4 flex items-center justify-between border-b-2 border-slate-300 bg-slate-100 dark:bg-slate-950 sticky shadow-lg">
      <div className="font-bold text-3xl pl-10">{getTitle()} 
      </div>

      <div className="flex items-center">
        {/* Links container needs to be relative for the indicator */}
        <div
          ref={linksContainerRef}
          className="relative flex items-center gap-6"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "nav-item-active" : ""}`
            }
          >
            Home Page
          </NavLink>

          <NavLink
            to="/dashboard1"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "nav-item-active" : ""}`
            }
          >
            EEC Emissions Baseline Dashboard
          </NavLink>

          <NavLink
            to="/dashboard2"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "nav-item-active" : ""}`
            }
          >
            Decarbonization Technology Dashboard
          </NavLink>

          <NavLink
            to="/dashboard3"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "nav-item-active" : ""}`
            }
          >
            Emission Abatement Pathways
          </NavLink>

          {/* Sliding line indicator */}
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute -bottom-1 h-1 rounded-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: 0, transform: "translateX(0px)" }}
          />
        </div>

        <button
          className="ml-6 cursor-pointer"
          // onClick={() => setDark((p) => !p)}  
          onClick={() => setDark(false)}  
        >
          {dark ? (
            <img src="src/assets/sun.svg" alt="sun logo" className="w-6 h-6" />
          ) : (
            <img src="src/assets/moon.svg" alt="moon logo" className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}