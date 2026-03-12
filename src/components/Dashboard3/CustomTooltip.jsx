export function CustomTooltip({ active, label, payload, analysisDimension, hoveredKey }){
  if (!active || !payload?.length) return null;

  // `label` is the X value (year)
  const year = label;

  // The full row object for this year is on payload[0].payload
  const row = payload[0]?.payload;

  // We only want tooltip when we know which stack is hovered
  if (!hoveredKey || !row) return null;

  const emissionAbated = Number(row[`__ea__${hoveredKey}`] ?? 0);

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow">
      <div className="text-xs text-black">{analysisDimension}: {hoveredKey}</div>
      <div className="mt-1 text-xs text-black">Year: {year}</div>
      <div className="text-xs text-black">
        Emission Abated:{" "}
        {emissionAbated.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}