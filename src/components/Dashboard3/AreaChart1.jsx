import StackedAreaChart1 from "./StackedAreaChart1"

export function AreaChart1({ rows, col, selectedKey, setSelectedKey, cost }) {
    return (
        <div className="h-full flex flex-col">
            <div className="h-10 px-5 text-2xl font-semibold">
                Emissions to be Abated (All Company)
            </div>
            <div className="relative h-full w-full pr-2 border-2 border-slate-300 shadow-lg rounded-lg flex text-center">
                <div className="h-full w-full pb-2">
                    <StackedAreaChart1 rows={rows} col={col} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
                </div>
                <div className="absolute top-5 left-20 text-sm">
                    <div className="flex flex-col h-30 w-40 bg-red-500 text-white border border-slate-300 shadow-md rounded-md">
                        <div className="w-40 h-10 pt-1">
                            Weighted avg cost ($/tons) 

                        </div>
                        <div className="h-20 w-40 flex items-center justify-center text-2xl text-center">
                            {Number(cost).toFixed(1)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}