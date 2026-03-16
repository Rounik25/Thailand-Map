import { useMemo } from "react";
import { CountUpNumber } from "./components/HomePage/CountUpNumber";
import MapDashboard1 from "./components/Dashboard1/MapDashboard1";
import { Link } from "react-router-dom";

export function HomePage({ rows }) {
    const [
        capacity,
        PttCapacity,
        Non_PttCapacity,
        uniqueCompany,
        uniquePttComp,
        uniqueNonPttComp,
        emission,
        emissionPtt,
        emissionNonPtt
    ] = useMemo(() => {
        let cap = 0;
        let pttCap = 0;
        let nonCap = 0;
        let emi = 0;
        let emiPtt = 0;
        let emiNonPtt = 0;

        const uniqueComp = [
            ...new Set(
                rows
                    .map((r) => r["Company Name"])
                    .filter((v) => v && v !== "-")
            ),
        ];

        rows.map(r => {
            emi = emi + Number(r["Process"]) + Number(r["Fuel"]) + Number(r["Indirect_Electricity"])
            if (r["Conglomerate"] === "PTT Entity") {
                emiPtt = emiPtt + Number(r["Process"]) + Number(r["Fuel"]) + Number(r["Indirect_Electricity"])
            }
            else if (r["Conglomerate"] === "Non-PTT Entity") {
                emiNonPtt = emiNonPtt + Number(r["Process"]) + Number(r["Fuel"]) + Number(r["Indirect_Electricity"])
            }
        })

        const uniquePTTComp = [
            ...new Set(
                rows
                    .filter((row) => row["Conglomerate"] === "PTT Entity")
                    .map((r) => r["Company Name"])
                    .filter((v) => v && v !== "-")
            ),
        ];

        const uniqueNonPTTComp = [
            ...new Set(
                rows
                    .filter((row) => row["Conglomerate"] === "Non-PTT Entity")
                    .map((r) => r["Company Name"])
                    .filter((v) => v && v !== "-")
            ),
        ];

        const tonnesRows = rows.filter((r) => r["Capacity unit"] === "Tonnes");

        tonnesRows.forEach((r) => {
            const raw = r["Capacity"];
            if (raw === "-" || raw === "") return;

            const num = Number(raw.toString().replace(/,/g, ""));
            if (Number.isNaN(num)) return;

            cap += num;

            if (r["Conglomerate"] === "Non-PTT Entity") {
                nonCap += num;
            } else if (r["Conglomerate"] === "PTT Entity") {
                pttCap += num;
            }
        });



        cap /= 1000000;
        pttCap /= 1000000;
        nonCap /= 1000000;

        return [
            cap,
            pttCap,
            nonCap,
            uniqueComp.length,
            uniquePTTComp.length,
            uniqueNonPTTComp.length,
            emi,
            emiPtt,
            emiNonPtt
        ];
    }, [rows]);
    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex h-3/10 w-full p-5">
                <div className="flex w-1/3 h-full bg-white p-5 mr-5 justify-evenly shadow-xl rounded-xl">
                    <div className="flex flex-col text-center items-center justify-center">
                        <div className="text-3xl"><CountUpNumber value={capacity} duration={500} decimals={1} suffix="M" /></div>
                        <div className="text-gray-600">Total Capacity (tonnes)</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex h-1/2 items-center justify-between text-center">
                            <div className="w-4/5">
                                PTT:
                            </div>
                            <div className="w-1/5">
                                <CountUpNumber value={PttCapacity} duration={500} decimals={1} suffix="M" />
                            </div>
                        </div>
                        <div className="flex h-1/2 items-center justify-between text-center">
                            <div className="w-4/5">
                                Non-PTT:
                            </div>
                            <div className="w-1/5">
                                <CountUpNumber value={Non_PttCapacity} duration={500} decimals={1} suffix="M" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex w-1/3 h-full bg-white p-5 mr-5 justify-evenly shadow-xl rounded-xl">
                    <div className="flex flex-col text-center items-center justify-center">
                        <div className="text-3xl"><CountUpNumber value={uniqueCompany} duration={500} decimals={0} /></div>
                        <div className="text-gray-600">Total Company</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex h-1/2 w-full items-center justify-between text-center">
                            <div className="w-25">
                                PTT:
                            </div>
                            <div className="w-10">
                                <CountUpNumber value={uniquePttComp} duration={500} decimals={0} />
                            </div>
                        </div>
                        <div className="flex h-1/2 items-center justify-between text-center">
                            <div className="w-25">
                                Non-PTT:
                            </div>
                            <div className="w-10">
                                <CountUpNumber value={uniqueNonPttComp} duration={500} decimals={0} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex w-1/3 h-full bg-white p-5 justify-evenly shadow-xl rounded-xl">
                    <div className="flex flex-col text-center items-center justify-center">
                        <div className="text-3xl"><CountUpNumber value={emission} duration={500} decimals={1} /></div>
                        <div className="text-gray-600">Total Emission</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex h-1/2 items-center justify-between text-center">
                            <div className="w-25">
                                PTT:
                            </div>
                            <div className="w-10">
                                <CountUpNumber value={emissionPtt} duration={500} decimals={1} />
                            </div>
                        </div>
                        <div className="flex h-1/2 items-center justify-between text-center">
                            <div className="w-25">
                                Non-PTT:
                            </div>
                            <div className="w-10">
                                <CountUpNumber value={emissionNonPtt} duration={500} decimals={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-1">
                <div className="flex flex-col w-1/3 p-5 px-20 justify-evenly">
                    <div className="flex p-5 px-10 bg-white shadow-xl rounded-full text-center justify-between">
                        <div className="text-2xl text-center flex-1">Analytic View</div>
                        <Link className="bg-red-600 p-2 rounded-xl shadow-md hover:bg-red-500" to="/dashboard1">
                            <img src="src\assets\step-forward.svg" alt="next logo" />
                        </Link>
                    </div>
                    <div className="flex p-5 px-10 bg-white shadow-xl rounded-full text-center justify-between">
                        <div className="text-2xl text-center flex-1">MACC View</div>
                        <Link className="bg-red-600 p-2 rounded-xl shadow-md hover:bg-red-500" to="/dashboard2">
                            <img src="src\assets\step-forward.svg" alt="next logo" />
                        </Link>
                    </div>
                    <div className="flex p-5 px-10 bg-white shadow-xl rounded-full text-center justify-between">
                        <div className="text-2xl text-center flex-1">Abatement View</div>
                        <Link className="bg-red-600 p-2 rounded-xl shadow-md hover:bg-red-500" to="/dashboard3">
                            <img src="src\assets\step-forward.svg" alt="next logo" />
                        </Link>
                    </div>
                </div>
                <div className="w-2/3 h-full p-5 pt-0">
                    <div className="w-full h-full shadow-xl rounded-xl">
                        <MapDashboard1 rows={rows} analysisDimension="Entity" />
                    </div>
                </div>
            </div>
        </div>
    )
}