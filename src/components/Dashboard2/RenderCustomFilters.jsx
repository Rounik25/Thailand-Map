import { Select } from "../common/Select";

export function RenderCustomFilters({ selected, setSelected, col1Value, col2Value, COL1_ID, COL2_ID, col2OptionsAll, col1ToCol2s, col1OptionsAll, col2Options, col2ToCol1}) {
    return (
        <>
            <Select
                label="Decarbonization Lever"
                value={col1Value}
                onChange={(nextCol1) => {
                    const allowedTechs =
                        nextCol1 === "All"
                            ? col2OptionsAll
                            : ["All", ...Array.from(col1ToCol2s.get(nextCol1) ?? []).sort()];

                    const nextCol2 = allowedTechs.includes(col2Value) ? col2Value : "All";

                    setSelected((p) => ({
                        ...p,
                        [COL1_ID]: nextCol1,
                        [COL2_ID]: nextCol2,
                    }));
                }}
                options={col1OptionsAll}
            />

            <Select
                label="Technology"
                value={col2Value}
                onChange={(nextCol2) => {
                    const mappedCol1 =
                        nextCol2 === "All"
                            ? selected[COL1_ID]
                            : col2ToCol1.get(nextCol2) ?? selected[COL1_ID];

                    setSelected((p) => ({
                        ...p,
                        [COL2_ID]: nextCol2,
                        [COL1_ID]: mappedCol1,
                    }));
                }}
                options={col2Options}
            />
        </>
    )
}