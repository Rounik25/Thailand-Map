import { LeftTab1 } from "./components/Tab1/LeftTab1"
import { RightTab1 } from "./components/Tab1/RightTab1"
import { FilterTab1 } from "./components/Tab1/FilterTab1"

export function Tab1() {

    return (
        <div className="flex h-[90vh] justify-between">
            <div className="w-15/20 flex flex-col h-full bg-white mx-10 shadow-lg">
                <div className="text-2xl font-bold border-b-2 border-red-600 px-1 pb-2">Emission Dashboard (1/3)</div>
                <div className="flex h-full w-full">
                    <LeftTab1 />
                    <RightTab1 />
                </div>
                <div className="text-gray-700">
                    <p className="m-2"><b>Note: </b>To be updated | <b>Source: </b>Industries and PP Factbase</p>
                    <p className="m-2">This information is confidential and was prepared by Bain & Company solely for the use of our client; it is not to be relied on by any 3rd party without Bain's prior written consent.</p>
                </div>
            </div>
            <div className="bg-white w-7/40 mx-10 shadow-2xl">
                <FilterTab1 />
            </div>
        </div>
    )
}