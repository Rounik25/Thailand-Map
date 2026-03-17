const DIMENSION_TO_COLUMN = {
    Entity: "Conglomerate",
    Sector: "Industry",
    "Decarbonization Plan": "Decarbonization Plan",
};

// You said you’ll modify these per dimension 
const FIXED_COLORS = {
    Entity: {
        "PTT Entity": "#cc0000",
        "Non-PTT Entity": "#46647b",
    },

    Sector: {
        "Cement and Concrete Product Manufacturing": "#9c487f",
        "Chemicals": "#1c4b74",
        "Metal Products Manufacturing": "#529045",
        "Miscellaneous Transportation Equipment Manufacturing": "#16a34a",
        "Motor Vehicle Manufacturing": "#64c693",
        "Motor Vehicle Parts Manufacturing": "#a855f7",
        "Non-Metallic Mineral Product Manufacturing": "#faecdb",
        "Paint, Coating, and Adhesive Manufacturing": "#64748b",
        "Paper Product Manufacturing": "#ab8933",
        "Plastic Product Manufacturing": "#bcf3ac",
        "Refining": "#7D9AB3",
        "Rubber Product Manufacturing": "#18490e",
        "Power Plants - Coal": "#CAD5DF",
        "Power Plants - Natural Gas": "#00284b",
        "Transport - Airport": "#5f2e36",
        "Transport - Truck": "#002559",
        "Transport - Shipping": "#925300",
    },

    "Decarbonization Plan": {
        // Replace keys EXACTLY as they appear in your Excel "Decarbonization Plan" column
        "Companies with net zero target beyond 2045": "#497659",
        "Companies with no stated decarbonization ambitions": "#639fbb",
        "Companies with net zero target by 2045": "#c16d6d",
        "Companies with no net-zero targets but have compliance-led decarbonization ambitions": "#f59e0b",
    },
};

const FIXED_COLORS_DARK = {
    Entity: {
        "PTT Entity": "#ff0000",
        "Non-PTT Entity": "#0091ff",
    },

    Sector: {
        "Cement and Concrete Product Manufacturing": "#104c3e",
        "Chemicals": "#507867",
        "Metal Products Manufacturing": "#cfb793",
        "Miscellaneous Transportation Equipment Manufacturing": "#16a34a",
        "Motor Vehicle Manufacturing": "#0ea5e9",
        "Motor Vehicle Parts Manufacturing": "#a855f7",
        "Non-Metallic Mineral Product Manufacturing": "#faecdb",
        "Paint, Coating, and Adhesive Manufacturing": "#64748b",
        "Paper Product Manufacturing": "#ab8933",
        "Plastic Product Manufacturing": "#cbcf62",
        "Refining": "#faeec3",
        "Rubber Product Manufacturing": "#083000",
        "Power Plants - Coal": "#c6aa3d",
        "Power Plants - Natural Gas": "#e9cd49",
        "Transport - Airport": "#5f2e36",
        "Transport - Truck": "#002559",
        "Transport - Shipping": "#925300",
    },

    "Decarbonization Plan": {
        // Replace keys EXACTLY as they appear in your Excel "Decarbonization Plan" column
        "Companies with net zero target beyond 2045": "#16a34a",
        "Companies with no stated decarbonization ambitions": "#0ea5e9",
        "Companies with net zero target by 2045": "#cc3b3b",
        "Companies with no net-zero targets but have compliance-led decarbonization ambitions": "#f59e0b",
    },
};

const FALLBACK_COLOR = "#64748b"; // slate

export function buildColorMap(rows, analysisDimension, dark) {
    const column = DIMENSION_TO_COLUMN[analysisDimension];

    // Fixed map for this dimension (may be undefined if you haven’t defined it yet)
    const fixed = dark ? FIXED_COLORS_DARK[analysisDimension] ?? {} : FIXED_COLORS[analysisDimension] ?? {};

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