import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export function Navbar(/*{ dark, setDark }*/) {
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
    <header className="sticky top-0 z-[9999] bg-slate-100 dark:bg-slate-950 shadow-lg overflow-auto scrollbar-hide">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="h-full min-h-[56px] flex items-center justify-between py-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Prefer importing the logo:
              import TrueNorthLogo from 'src/assets/TrueNorthLogo.svg'
              then <img src={TrueNorthLogo} ... /> */}
            <div className="flex-shrink-0 w-10 h-10">
              <img src="src/assets/TrueNorthLogo.svg" alt="TN Logo" className="w-full h-full object-contain" />
            </div>

            <div className="font-bold text-xl sm:text-2xl truncate min-w-0">
              {getTitle()}
            </div>
          </div>

          <div className="flex items-center min-w-0">
            <div ref={linksContainerRef} className="relative flex items-center min-w-0">
              <nav className="flex gap-4 items-center overflow-x-auto scrollbar-hide whitespace-nowrap min-w-0 px-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `${linkBase} ${isActive ? "nav-item-active" : ""}`}
                >
                  Home Page
                </NavLink>

                <NavLink
                  to="/dashboard1"
                  className={({ isActive }) => `${linkBase} ${isActive ? "nav-item-active" : ""}`}
                >
                  EEC Emissions Baseline Dashboard
                </NavLink>

                <NavLink
                  to="/dashboard2"
                  className={({ isActive }) => `${linkBase} ${isActive ? "nav-item-active" : ""}`}
                >
                  Decarbonization Technology Dashboard
                </NavLink>

                <NavLink
                  to="/dashboard3"
                  className={({ isActive }) => `${linkBase} ${isActive ? "nav-item-active" : ""}`}
                >
                  Emission Abatement Pathways
                </NavLink>
              </nav>

              {/* Sliding line indicator */}
              <span
                ref={indicatorRef}
                className="pointer-events-none absolute -bottom-1 h-1 rounded-full bg-red-600 transition-all duration-300 ease-out"
                style={{ width: 0, transform: "translateX(0px)" }}
              />
            </div>

            {/* optional theme toggle - keep it shrink-0 */}
            {/* <button className="ml-4 shrink-0" onClick={() => setDark(p => !p)}>
            {dark ? <img src="src/assets/sun.svg" alt="sun" className="w-6 h-6" /> :
                    <img src="src/assets/moon.svg" alt="moon" className="w-6 h-6" />}
          </button> */}
          </div>
        </div>
      </div>
    </header>
  );
}