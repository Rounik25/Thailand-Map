import Map from "../Map"

export function LeftTab1(){
    return (
        <div className="w-1/2 h-18/20">
            <div className="bg-stone-600 mt-5 mb-2 mx-2 text-center text-white">Geographical view</div>
            <div className="h-20/20 p-2">
                <Map />
            </div>
        </div>
    )
}