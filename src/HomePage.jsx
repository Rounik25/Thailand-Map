import FlipCard from "./components/HomePage/FlipCard"

export function HomePage() {
    const cards = [
        {
            id: "Dashboard1",
            name: "EEC Emission Baseline ",
            url: "dashboard1"
        },
        {
            id: "Dashboard2",
            name: "Decarbonization Technology",
            url: "dashboard2",
        },
        {
            id: "Dashboard3",
            name: "Emission Abatement Pathways",
            url: "dashboard3",
        }
    ]
    return (
        <div className="h-full w-full">
            <div className="h-full w-full flex justify-evenly items-center">
                {cards.map(card => {
                    return (
                        <div key={card.id} className="h-100 w-100">
                            <FlipCard data={card} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}