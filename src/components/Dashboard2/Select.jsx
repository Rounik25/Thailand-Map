import { useState, useEffect, useRef } from "react";

export function Select({ label, value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div ref={containerRef} className="relative w-full min-w-0 flex flex-col gap-1">
            <span className="text-sm font-medium text-black dark:text-slate-300">
                {label}
            </span>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full h-7 min-w-0 border-2 border-slate-200 bg-white px-3 text-sm text-left text-black rounded-lg
             dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            >
                <span className="block truncate w-full">
                    {value || "Select option"}
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 top-full mt-1 w-full min-w-0 border border-slate-200 bg-white rounded-lg shadow-lg z-50
               dark:border-slate-700 dark:bg-slate-900 max-h-48 overflow-y-auto">

                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 
                            dark:hover:bg-slate-800 whitespace-normal break-words"
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}