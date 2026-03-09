import React from "react";
import { TECHNOLOGY_COLORS } from "../../utils/Dashboard2/technologyLineColors";

export function TechnologyLegend({
  technologies = [],
  selectedTechnology = "All",
  onSelect,
  counts = {},
}) {
  return (
    <div className="grid grid-cols-1">
      {technologies.map((tech) => {
        const isActive = selectedTechnology === tech;
        const isFiltering = selectedTechnology !== "All";

        return (
          <button
            key={tech}
            onClick={() => onSelect?.(tech)}
            className={`flex items-center justify-between w-full px-2 rounded-md text-left transition-all duration-200
                ${isFiltering
                ? isActive
                  ? "opacity-100 font-medium bg-slate-100"
                  : "opacity-30 hover:opacity-60"
                : "opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800"
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
  );
}