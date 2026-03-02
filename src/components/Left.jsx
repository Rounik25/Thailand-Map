import Map from "./Map"
import DataTable from "./DataTable"
import { enrichRecordsWithLocation } from "../utils/getData";
import { useMemo } from "react";

export function Left({ dark, records, locations }) {

    const tableRows = useMemo(
        () => enrichRecordsWithLocation(records, locations),
        [records, locations]
    );

    return (
        <div className="sm:w-6/10">
            <Map dark={dark} />
            <DataTable rows={tableRows} />
            
        </div>
    )
}