import React from "react";
import { TECHNOLOGY_COLORS } from "../../utils/Dashboard2/technologyLineColors";

export function TechnologyLegend({
  technologies = [],
  selectedTechnology = "All",
  onSelect,
  counts = {},
}) {
  return (
    <div className="mt-4 border-t pt-3">
      <div className="text-lg font-semibold mb-1 text-center text-red-600 font-bold">Legend</div>

      <div className="grid grid-cols-1">
        {technologies.map((tech) => {
          const isActive = selectedTechnology === tech;

          return (
            <button
              key={tech}
              onClick={() => onSelect?.(tech)}
              className={`flex items-center justify-between w-full px-2 py-2 rounded-md text-left transition
                ${
                  isActive
                    ? "ring-2 ring-offset-1 ring-sky-400 bg-slate-50 dark:bg-slate-900"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block w-4 h-4 rounded-sm border border-slate-200"
                  style={{
                    background:
                      TECHNOLOGY_COLORS[tech] ?? "#94a3b8",
                  }}
                />
                <span className="text-sm">{tech}</span>
              </div>

              {counts?.[tech] != null && (
                <div className="text-xs text-slate-500">
                  {counts[tech]}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}