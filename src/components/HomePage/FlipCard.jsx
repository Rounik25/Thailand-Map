import { useState } from "react";
import { Link } from "react-router-dom";

export default function FlipCard({data}) {
  const [flipped, setFlipped] = useState(false);
  const BackComp = data.component
  return (
    <div
      className="h-full w-full perspective"
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-lg shadow-lg bg-slate-100 hover:bg-slate-50 text-2xl">  
          {data.name}
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-100 shadow-lg flex items-center justify-center rounded-lg">
          <Link to={data.url} className="px-5 py-1 text-lg rounded-xl hover:bg-slate-200 bg-slate-300 shadow-lg">Visit</Link>
        </div>
      </div>
    </div>
  );
}