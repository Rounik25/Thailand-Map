export function Legends({ size }) {
    const minSize = Math.min(...size)/2
    const maxSize = Math.max(...size)/2
    const sum = size.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const avgSize = (sum/size.length)/2
    return (
        <div className="flex justify-evenly">
            <div className="h-30 w-20" >
                <div className="h-20 w-20 flex items-center justify-center" >
                    <div
                        style={{
                            width: `${minSize}px`,
                            height: `${minSize}px`,
                        }}
                        className="flex rounded-full bg-blue-500 flex items-center justify-center text-white text-md"
                    ></div>
                </div>
                <div className="h-10 w-20 text-center ">Min</div>
            </div>
            <div className="h-30 w-20 " >
                <div className="h-20 w-20 flex items-center justify-center" >
                        <div
                        style={{
                            width: `${avgSize}px`,
                            height: `${avgSize}px`,
                        }}
                        className="rounded-full bg-blue-500 flex items-center justify-center text-white text-md"
                    ></div>
                </div>
                <div className="h-20 w-20 text-center" >Average</div>
            </div>
            <div className="h-30 w-20" >
                <div className="h-20 w-20 flex items-center justify-center" >
                        <div
                        style={{
                            width: `${maxSize}px`,
                            height: `${maxSize}px`,
                        }}
                        className="rounded-full bg-blue-500 flex items-center justify-center text-white text-md"
                    ></div>
                </div>
                <div className="h-20 w-20 text-center" >Max</div>
            </div>
        </div>
    )
}