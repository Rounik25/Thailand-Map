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
            value: minVolume,
            color: "#7D9AB3"
        },
        {
            text: "PTT abatement volume",
            value: Ptt.toFixed(1),
            color: "#8FA7BB"
        },
        {
            text: "Non-PTT abatement volume",
            value: Non_ptt.toFixed(1),
            color: "#9AAFC2"
        },
        {
            text: "Average cost of abatedment for only PTT entities ($/ton)",
            value: avgPTT_Col,
            color: "#B7C6D4"
        },
        {
            text: "Average cost of abatedment for all entities ($/ton)",
            value: avgNon_PTT_Col,
            color: "#CAD5DF"
        },
    ]

    return (
        <div className="h-full w-full flex justify-between items-start">
            {kpiData.map(kpi => {
                return (
                    <div 
                        key={kpi.text} 
                        style={{backgroundColor: kpi.color}} 
                        className={`h-40 w-40 text-black rounded-xl p-4 hover:bg-slate-50 m-1`}
                    >
                        <div className=" h-10 text-center text-2xl font-semibold pb-4">{kpi.value}</div>
                        <div className="flex h-15 py-1 text-sm text-center">{kpi.text}</div>
                    </div>
                )
            })}
        </div>
    )
}