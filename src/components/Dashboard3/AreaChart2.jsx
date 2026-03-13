import StackedAreaChart2 from "./StackedAreaChart2"

export function AreaChart2({ rows, col, selectedKey, setSelectedKey, cost }) {
    return (
        <div className="h-full flex flex-col">
            <div className="h-10 px-5 text-xl font-semibold text-center">
                PTT
            </div>
            <div className="relative h-full w-full pr-2 rounded-lg text-center ">
                <div className="h-full w-full pb-2">
                    <StackedAreaChart2 rows={rows} col={col} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
                </div>
                <div className="absolute top-5 left-20 text-sm">
                    <div className="flex flex-col h-30 w-40 bg-gray-500 text-white rounded-md">
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
    