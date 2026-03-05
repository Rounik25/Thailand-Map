import { FilterTab2 } from "./components/Tab2/FilterTab2"
import { CardsTab2 } from "./components/Tab2/CardsTab2"
import Map from "./components/Map"
import { MapRadialChart } from "./components/Tab2/MapRadialChart";

export function Tab2() {
    const dummy = [
        { region: "Central", ptt: 62, nonPtt: 38 },
        { region: "North", ptt: 45, nonPtt: 55 },
        { region: "Northeast", ptt: 52, nonPtt: 48 },
        { region: "South", ptt: 35, nonPtt: 65 },
    ];

    return (
        <div className="w-[100%] h-[100vh] bg-white flex justify-between">
            <div className="h-[100%] w-3/10 m-10">
                <CardsTab2 />
            </div>

            <div className="w-5/10 h-[100%]">
                <div className="h-3/20 mt-10 mb-5 flex rounded-xl justify-evenly items-center">
                    <MapRadialChart data={dummy} />
                </div>
                <div className="h-13/20 shadow-lg rounded-xl bg-slate-100 flex">
                    <Map />
                </div>
            </div>

            <div className="h-82/100 w-3/20 rounded-xl m-10 border-1 border-slate-200 shadow-lg">
                <FilterTab2 />
            </div>
        </div>
    )
}