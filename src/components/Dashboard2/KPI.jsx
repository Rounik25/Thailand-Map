export function KPI({ rows }) {
    const minVolCOl = "Minimum volume required (Mn TCo2 abated)";
    const minVolume = Number(rows?.[0]?.[minVolCOl] ?? 0).toFixed(1);
    const Non_PTT_Col = "Wtd average cost of abatement ($/ ton Co2)"
    const avgNon_PTT_Col = Number(rows?.[0]?.[Non_PTT_Col] ?? 0).toFixed(1);
    const PTT_Col = "Avg_Wtd average cost of abatement ($/ ton Co2)-PTT"
    const avgPTT_Col = Number(rows?.[0]?.[PTT_Col] ?? 0).toFixed(1);
    const kpiData = [
        {
            text: "Minimum volume required \n (Mn TCo2 abeted)",
            value: minVolume
        },
        {
            text: "PTT abatement volume",
            value: 2.2
        },
        {
            text: "Non-PTT abatement volume",
            value: 7.5
        },
        {
            text: "Weighted average cost of abatedment \n (if PTT does for self)",
            value: avgNon_PTT_Col
        },
        {
            text: "Weighted average cost of abatedment \n (if PTT does for others)",
            value: avgPTT_Col
        },
    ]

    console.log(minVolume)

    return (
        <div className="h-full w-full flex justify-evenly items-center pb-20">
            {kpiData.map(kpi => {
                return (
                    <div key={kpi.text} className="h-30 w-30 rounded-xl border-2 border-slate-300 bg-slate-100 p-4 shadow-lg hover:bg-slate-50">
                        <div className="flex h-12 py-1 text-xs text-center items-center">{kpi.text}</div>
                        <div className="text-center text-xl font-semibold pt-4">{kpi.value}</div>
                    </div>
                )
            })}
        </div>
    )
}