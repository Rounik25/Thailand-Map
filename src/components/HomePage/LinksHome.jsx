import { Link } from "react-router-dom";

export function LinksHome() {
    return (
        <div className="flex flex-col h-full w-full min-h-0 min-w-0 overflow-hidden justify-between rounded-xl min-h-0 min-w-0 overflow-hidden">
            <div className="flex p-5 h-2/7 px-10 bg-white shadow-xl rounded-xl text-center justify-between items-center min-h-0 min-w-0 overflow-hidden">
                <div className="text-2xl text-center flex-1 min-h-0 min-w-0 overflow-hidden">Analytic View</div>
                <Link className="bg-red-600 p-2 rounded-xl shadow-md hover:bg-red-500 min-h-0 min-w-0 overflow-hidden" to="/dashboard1">
                    <img className="h-10 w-10 min-h-0 min-w-0 overflow-hidden" src="src\assets\step-forward.svg" alt="next logo" />
                </Link>
            </div>
            <div className="flex p-5 h-2/7 px-10 bg-white shadow-xl rounded-xl text-center justify-between items-center min-h-0 min-w-0 overflow-hidden">
                <div className="text-2xl text-center flex-1 min-h-0 min-w-0 overflow-hidden">MACC View</div>
                <Link className="bg-red-600 p-2 rounded-xl shadow-md hover:bg-red-500 min-h-0 min-w-0 overflow-hidden" to="/dashboard2">
                    <img className="h-10 w-10 min-h-0 min-w-0 overflow-hidden" src="src\assets\step-forward.svg" alt="next logo" />
                </Link>
            </div>
            <div className="flex p-5 h-2/7 px-10 bg-white shadow-xl rounded-xl text-center justify-between items-center min-h-0 min-w-0 overflow-hidden">
                <div className="text-2xl text-center flex-1 min-h-0 min-w-0 overflow-hidden">Abatement View</div>
                <Link className="bg-red-600 p-2 rounded-xl shadow-md hover:bg-red-500 min-h-0 min-w-0 overflow-hidden" to="/dashboard3">
                    <img className="h-10 w-10 min-h-0 min-w-0 overflow-hidden" src="src\assets\step-forward.svg" alt="next logo" />
                </Link>
            </div>
        </div>
    )
}