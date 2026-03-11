import StackedAreaChart1 from "./StackedAreaChart1"

export function AreaChart1({ rows, col, selectedKey, setSelectedKey, cost }) {
    return (
        <div className="h-full flex flex-col items-end text-center">
            <div className="h-1/10 w-9/10 p-5 text-lg font-semibold text-white " >
                <div className="bg-black p-1">
                    Emissions to be Abated (All Company)
                </div>
            </div>
            <div className="h-8/10 w-full pl-5">
                <StackedAreaChart1 rows={rows} col={col} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
            </div>
            <div className="h-1/10 w-9/10 p-5 pb-10" >
                <div className="h-full w-full flex justify-center items-center text-lg ">
                    <div className="p-2 bg-red-500 text-white w-full">
                        Weighted average cost of abatement ($/tons): {Number(cost).toFixed(1)}
                    </div>
                </div>
            </div>
        </div>
    )
}