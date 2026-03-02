import { Left } from "./components/Left"
import { Right } from "./components/Right"
import { useMemo, useState } from "react";
import { getFilteredData } from "./utils/getData";

export function HomePage({ dark }) {

    const [filters, setFilters] = useState({
        month: "All",
        city: "All",
        region: "All",
        category: "All",
    });

    const { records, locations } = useMemo(() => getFilteredData(filters), [filters]);

    

    return (
        <div className="flex h-screen sm:flex-row p-10">
            <Left dark={dark} records={records} locations={locations} />
            <Right dark={dark} records={records} locations={locations} filters={filters} setFilters={setFilters} />
        </div>
    )
}