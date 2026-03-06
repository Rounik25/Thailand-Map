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

  // can remove the setDark statement when enabling the onclick effect of theme button
  setDark(false)

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
    "px-2 py-1 font-semibold text-lg text-slate-700 dark:text-slate-200";

  return (
    <div className="h-15 px-4 flex items-center justify-between bg-white dark:bg-black border-slate-200 border-2 shadow-sm mb-2 ">
      <div className="font-bold text-xl">{getTitle()} 
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
              `${linkBase} ${isActive ? "nav-item-active text-blue-600" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard1"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "nav-item-active text-blue-600" : ""}`
            }
          >
            Dashboard-1
          </NavLink>

          <NavLink
            to="/dashboard2"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "nav-item-active text-blue-600" : ""}`
            }
          >
            Dashboard-2
          </NavLink>

          <NavLink
            to="/dashboard3"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "nav-item-active text-blue-600" : ""}`
            }
          >
            Dashboard-3
          </NavLink>

          {/* Sliding line indicator */}
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute -bottom-1 h-1 rounded-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: 0, transform: "translateX(0px)" }}
          />
        </div>

        <button
          className="ml-6"
        // onClick={() => setDark((p) => !p)}
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