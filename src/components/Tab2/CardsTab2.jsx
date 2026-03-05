import { BarChartTab2 } from "./BarChartTab2"

function updateData(rows, emmisionType) {
    let ptt = 0;
    let non_ptt = 0;

    rows.forEach(r => {
        let total = 0
        const process = Number(r.Process || 0);
        const fuel = Number(r.Fuel || 0);
        const elec = Number(r.Indirect_Electricity || 0);
        if (emmisionType === "Process") {
            total = process
        }
        else if (emmisionType === "Fuel") {
            total = fuel
        }
        else if (emmisionType === "Indirect_Electricity") {
            total = elec
        }
        else {
            total = process + fuel + elec 
        }

        if (r.Conglomerate === "PTT Entity") {
            ptt += total;
        } else if (r.Conglomerate === "Non-PTT Entity") {
            non_ptt += total;
        }
    });

    return [
        { type: "PTT", value: ptt.toFixed(2) },
        { type: "Non-PTT", value: non_ptt.toFixed(2) }
    ];
}

// [
//         { type: "Non-PTT", value: 47.1 },
//         { type: "PTT", value: 31.8 }
//     ]
export function CardsTab2({ rows, emissionType }) {
    const data = updateData(rows, emissionType)
    return (
        <div className="h-full">
            {/* <div className="h-4/10 mb-5">
                <LineChartTab2 />
            </div> */}
            <div className="h-8/10 border-1 border-slate-200 rounded-xl shadow-lg">
                <BarChartTab2 data={data} />
            </div>
        </div>
    )
}