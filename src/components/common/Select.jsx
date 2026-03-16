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
    <div ref={containerRef} className="relative w-full min-w-0 flex flex-col mt-1">
      <span className="text-md font-medium text-black dark:text-slate-300">
        {label}
      </span>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between w-full h-8 min-w-0 border-2 border-slate-200 bg-white pl-3 text-sm text-left text-gray-600 font-medium rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
      >
        <span className="block truncate w-full text-md py-1">{value || "Select option"}</span>
        <img src="src\assets\Select-down.svg" alt="downLogo" />
      </button>

      {open && (
        <div className="absolute left-0 top-full w-full min-w-0 border border-slate-200 bg-white rounded-lg shadow-lg z-50 dark:border-slate-700 dark:bg-slate-900 max-h-48 overflow-y-auto">
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
