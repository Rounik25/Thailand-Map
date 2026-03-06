const DIMENSION_TO_COLUMN = {
    Entity: "Conglomerate",
    Sector: "Industry",
    "Decarbonization Plan": "Decarbonization Plan",
};

// You said you’ll modify these per dimension 
const FIXED_COLORS = {
    Entity: {
        "PTT Entity": "#dc2626",
        "Non-PTT Entity": "#385697",
    },

    Sector: {
        // Replace keys EXACTLY as they appear in your Excel "Industry" column
        "Cement and Concrete Product Manufacturing": "#dc2626",
        "Chemicals": "#385697",
        "Metal Products Manufacturing": "#f59e0b",
        "Miscellaneous Transportation Equipment Manufacturing": "#16a34a",
        "Motor Vehicle Manufacturing": "#0ea5e9",
        "Motor Vehicle Parts Manufacturing": "#a855f7",
        "Non-Metallic Mineral Product Manufacturing": "#f97316",
        "Paint, Coating, and Adhesive Manufacturing": "#64748b",
        "Paper Product Manufacturing": "#648a8b",
        "Plastic Product Manufacturing": "#cbcf62",
        "Refining": "#8b6464",
        "Rubber Product Manufacturing": "#083000",
        "Power Plants - Coal": "#64748b",
        "Power Plants - Natural Gas": "#fbe1ff",
        "Transport - Airport": "#5f2e36",
        "Transport - Truck": "#002559",
        "Transport - Shipping": "#925300",
    },

    "Decarbonization Plan": {
        // Replace keys EXACTLY as they appear in your Excel "Decarbonization Plan" column
        "Companies with net zero target beyond 2045": "#16a34a",
        "Companies with no net zero ambitions but have decarbonization ambitions": "#f59e0b",
        "Companies with no stated decarbonization ambitions": "#0ea5e9",
        "Companies with net zero target by 2045": "#64748b",
        "Companies with no decarb ambitions but have regulatory exposure to Europe": "#8b6482",
    },
};

const FALLBACK_COLOR = "#64748b"; // slate

export function buildColorMap(rows, analysisDimension) {
    const column = DIMENSION_TO_COLUMN[analysisDimension];

    // Fixed map for this dimension (may be undefined if you haven’t defined it yet)
    const fixed = FIXED_COLORS[analysisDimension] ?? {};

    // Optional: collect uniques (useful for legend / debugging)
    const uniques = Array.from(
        new Set(
            (rows ?? [])
                .map((r) => String(r?.[column] ?? "").trim())
                .filter(Boolean)
        )
    );

    // Build colorByValue based on fixed mapping, fallback for unknowns
    const colorByValue = {};
    uniques.forEach((val) => {
        colorByValue[val] = fixed[val] ?? FALLBACK_COLOR;
    });

    return { column, colorByValue, uniques, fallbackColor: FALLBACK_COLOR };
}