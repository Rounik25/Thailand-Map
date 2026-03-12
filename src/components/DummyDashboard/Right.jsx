import { Cards } from "./Cards"

export function Right({ dark, records, locations, filters, setFilters }) {
    console.log("right: ", dark)
    
    return (
        <div className={"sm:w-4/10 pl-10"}>
            <Cards records={records} locations={locations} filters={filters} setFilters={setFilters}  />
        </div>
    )
}