import { LinksHome } from "./components/HomePage/LinksHome";
import { Statistics } from "./components/HomePage/Statistics";
import MapDashboard1 from "./components/Dashboard1/MapDashboard1";

export function HomePage({ rows }) {
    return (
        <div className="h-full w-full min-h-0 min-w-0 overflow-y-auto scrollbar-hide">
            <div className="flex flex-col xl:flex-row h-full min-h-full min-w-0 gap-5 p-5">
                {/* Left panel */}
                <div className="w-full xl:w-[32%] shrink-0 min-h-0 min-w-0">
                    <div className="h-full min-h-30 min-w-0">
                        <LinksHome />
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex flex-1 flex-col min-h-0 min-w-0 gap-5">
                    {/* Statistics */}
                    <div className="w-full min-h-[120px] shrink-0 min-w-0">
                        <Statistics rows={rows} />
                    </div>

                    {/* Map */}
                    <div className="flex-1 min-h-[30] min-w-0 rounded-xl">
                        <div className="w-full h-full rounded-xl shadow-xl overflow-hidden">
                            <MapDashboard1 rows={rows} analysisDimension="Entity" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}