import { useState, useEffect, useRef } from "react";

export function Select({ label, value, onChange, options = [] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-w-0 flex flex-col mt-2">
      <span className="text-sm font-medium text-black dark:text-slate-300 truncate">
        {label}
      </span>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full min-w-0 min-h-9 border-2 border-slate-200 bg-white pl-3 pr-2 text-sm text-left text-gray-600 font-medium rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
      >
        <span className="block flex-1 min-w-0 truncate py-1">
          {value || "Select option"}
        </span>
        <img
          src="src/assets/Select-down.svg"
          alt="downLogo"
          className="shrink-0 ml-2 w-4 h-4"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-0 border border-slate-200 bg-white rounded-lg shadow-lg z-50 dark:border-slate-700 dark:bg-slate-900 max-h-48 overflow-y-auto overflow-x-hidden">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-normal break-words"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
