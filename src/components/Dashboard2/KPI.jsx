export function KPI({ rowsD2V3, rowsD2V4_5 }) {
    const minVolCOl = "Minimum volume required (Mn TCo2 abated)";
    const minVolume = Number(rowsD2V4_5?.[0]?.[minVolCOl] ?? 0).toFixed(1);
    const Non_PTT_Col = "Wtd average cost of abatement ($/ ton Co2)"
    const avgNon_PTT_Col = Number(rowsD2V4_5?.[0]?.[Non_PTT_Col] ?? 0).toFixed(1);
    const PTT_Col = "Avg_Wtd average cost of abatement ($/ ton Co2)-PTT"
    const avgPTT_Col = Number(rowsD2V4_5?.[0]?.[PTT_Col] ?? 0).toFixed(1);

    const ENTITY_COL = "Entity"; 
    const VOLUME_COL = "Volume";   

    const norm = (s) => (s ?? "").toString().trim().toLowerCase();
    const toNum = (v) => Number(String(v ?? "").replace(/,/g, "").trim()) || 0;
    let Ptt = 0;
    let Non_ptt = 0;

    (rowsD2V3 ?? []).forEach((r) => {
        const entity = norm(r?.[ENTITY_COL]);
        const vol = toNum(r?.[VOLUME_COL]);
        if (entity === "ptt entity") Ptt += vol;
        else if (entity === "non-ptt entity" || entity === "non ptt entity") Non_ptt += vol;
    });

    const kpiData = [
        {
            text: "Minimum volume required \n (Mn TCo2 abeted)",
            value: minVolume
        },
        {
            text: "PTT abatement volume",
            value: Ptt.toFixed(1)
        },
        {
            text: "Non-PTT abatement volume",
            value: Non_ptt.toFixed(1)
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