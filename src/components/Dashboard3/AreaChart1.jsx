import StackedAreaChart1 from "./StackedAreaChart1"

export function AreaChart1() {
    return (
        <div className="h-full flex flex-col items-end">
            <div className="h-2/10 w-9/10 p-5" >
                <div className="h-full flex border-2 border-slate-300 rounded-xl bg-slate-100 hover:bg-slate-50">
                    <div className="h-full w-7/10 flex justify-center items-center text-xl pl-2">
                        Weighted average cost of abatement ($/tons):
                    </div>
                    <div className="h-full w-2/10 flex justify-center items-center text-4xl">50.9</div>
                </div>
            </div>
            <div className="h-8/10 w-full pl-5 pb-10">
                <StackedAreaChart1 />
            </div>
        </div>
    )
}