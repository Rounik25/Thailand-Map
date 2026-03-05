import React from "react";
import RegionRadial from "./RegionRadial";

export function MapRadialChart({ data }) {
  return (
    <div className="flex justify-evenly w-full h-full">
      {data.slice(0, 4).map((r) => (
        <div key={r.region} className="h-full min-h-30 shadow-lg rounded-xl">
          <RegionRadial
            title={r.region}
            pttPct={r.ptt}
            nonPttPct={r.nonPtt}
          />
        </div>
      ))}
    </div>
  );
}