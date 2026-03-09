import React from "react";

const ENTITY_COLORS = {
    "PTT Entity": "#cc0000",      // red
    "Non-PTT Entity": "#46647b",  // blue
};

export function EntityLegend({
    selectedEntity = "All",
    onSelect,
    counts = {}, // optional: { "PTT Entity": 10, "Non-PTT Entity": 20 }
}) {
    const entities = ["PTT Entity", "Non-PTT Entity"];
    const isFiltering = selectedEntity !== "All";

    return (
        <div className="grid grid-cols-1">
            {entities.map((entity) => {
                const isActive = selectedEntity === entity;

                return (
                    <button
                        key={entity}
                        onClick={() => onSelect?.(entity)}
                        className={`flex items-center justify-between w-full px-2 rounded-md text-left transition-all duration-200
                ${isFiltering
                                ? isActive
                                    ? "opacity-100 font-medium"
                                    : "opacity-30 hover:opacity-60"
                                : "opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="inline-block w-4 h-4 rounded-sm border border-slate-200"
                                style={{ background: ENTITY_COLORS[entity] }}
                            />
                            <span className="text-sm">{entity}</span>
                        </div>

                        {counts?.[entity] != null && (
                            <div className="text-xs text-slate-500">{counts[entity]}</div>
                        )}
                    </button>
                );
            })}
        </div>

    );
}