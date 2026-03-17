import StackedAreaChart1 from "./StackedAreaChart1"

export function AreaChart1({ rows, col, selectedKey, setSelectedKey, cost }) {
    return (
        <div className="h-full flex flex-col min-h-0 min-w-0 overflow-hidden">
            <div className="h-10 px-5 text-xl font-semibold text-center min-h-0 min-w-0 overflow-hidden">
                All Company
            </div>
            <div className="relative h-full w-full pr-2 flex text-center min-h-0 min-w-0 overflow-hidden">
                <div className="h-full w-full pb-2 min-h-0 min-w-0 overflow-hidden">
                    <StackedAreaChart1 rows={rows} col={col} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
                </div>
                <div className="absolute top-5 left-20 text-sm min-h-0 min-w-0 overflow-hidden">
                    <div className="flex flex-col h-30 w-40 bg-gray-500 text-white rounded-md min-h-0 min-w-0 overflow-hidden">
                        <div className="w-40 h-10 pt-1 min-h-0 min-w-0 overflow-hidden">
                            Weighted avg cost ($/tons) 

                        </div>
                        <div className="h-20 w-40 flex items-center justify-center text-2xl text-center min-h-0 min-w-0 overflow-hidden">
                            {Number(cost).toFixed(1)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}