import StackedAreaChart2 from "./StackedAreaChart2"

export function AreaChart2({rows,col}){
    return (
        <div className="h-full flex flex-col items-end text-center">
            <div className="h-2/10 w-9/10 p-5" >
                <div className="h-full flex border-2 border-slate-300 rounded-xl bg-slate-100 hover:bg-slate-50">
                    <div className="h-full w-4/10 flex justify-center items-center text-xl pl-2">
                        Emissions to be Abated (PTT)
                    </div>
                    <div className="h-full w-6/10 flex flex-col justify-center items-center text-xl">
                        <div>
                            Weighted average cost of abatement ($/tons)
                        </div>
                        <div>
                            50.9
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-8/10 w-full pl-5 pb-10">
                <StackedAreaChart2 rows={rows} col={col} />
            </div>
        </div>
    )
}