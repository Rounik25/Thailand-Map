export function KPI(){
    const kpiData= [
    {
        text: "Minimum volume required \n (Mn TCo2 abeted)",
        value: 1.3
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
        value: 286.8
    },
    {
        text: "Weighted average cost of abatedment \n (if PTT does for others)",
        value: 192.4
    },
]
    return(
        <div className="h-full w-full flex justify-evenly items-center pb-20">
            {kpiData.map(kpi => {
                return(
                    <div className="h-30 w-30 rounded-xl border-2 border-slate-300 bg-slate-100 p-4 shadow-lg hover:bg-slate-50">
                        <div className="flex h-12 py-1 text-xs text-center items-center">{kpi.text}</div>
                        <div className="text-center text-xl font-semibold pt-4">{kpi.value}</div>
                    </div>
                )
            })}
        </div>
    )
}