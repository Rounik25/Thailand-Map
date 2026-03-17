import { TECHNOLOGY_COLORS } from "../../utils/Dashboard2/technologyLineColors";

export function TechnologyLegend({
  technologies = [],
  selectedTech,
  setSelectedTech,
  hoveredTech,
  setHoveredTech,
}) {
  return (
    <div className="w-full px-5 pb-2 min-h-0 min-w-0">
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 min-h-0 min-w-0">
        {technologies.map((tech) => {
          const isSelected = selectedTech === tech;
          const isFiltering = selectedTech != null;
          const dim = isFiltering && !isSelected;
          const color = TECHNOLOGY_COLORS[tech] || "#000000";

          return (
            <button
              key={tech}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTech((prev) => (prev === tech ? null : tech));
              }}
              onMouseEnter={() => setHoveredTech?.(tech)}
              onMouseLeave={() => setHoveredTech?.(null)}
              className="flex items-center gap-2 text-sm transition-opacity min-h-0 min-w-0"
              style={{ opacity: dim ? 0.35 : 1 }}
            >
              <span
                className="inline-block h-3 w-3 rounded min-h-0 min-w-0"
                style={{
                  backgroundColor: color,
                  transform: hoveredTech === tech ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.15s ease",
                }}
              />
              <span className={isSelected ? "font-semibold" : "font-normal"}>
                {tech}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}