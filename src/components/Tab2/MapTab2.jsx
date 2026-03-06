import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { buildColorMap } from "../../utils/mapColors";

// Vite-safe marker icon fix (CDN)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createDivIcon(value, color) {
  const size = ((value * 3000) ** (4 / 10)) // scale logic
  const radius = size / 2;

  return L.divIcon({
    html: `
      <div 
        style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background-color:${color};
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:12px;
          font-weight:600;
        ">
      </div>
    `,
    className: "",   // remove default leaflet styles
    iconSize: [size, size],
    iconAnchor: [radius, radius],
  });
}

function emissionValueForRow(r, emissionType) {
  const process = Number(r.Process || 0);
  const fuel = Number(r.Fuel || 0);
  const elec = Number(r.Indirect_Electricity || 0);

  switch (emissionType) {
    case "Process":
      return process;
    case "Fuel":
      return fuel;
    case "Indirect_Electricity":
      return elec;
    case "All":
    default:
      return process + fuel + elec;
  }
}

function setLocation(rows, emissionType, analysisDimension) {
  const { column, colorByValue } = buildColorMap(rows, analysisDimension);
  return rows
    .filter((r) => {
      const lat = Number(r.Latitude);
      const lng = Number(r.Longitude);

      return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        !(lat === 0 && lng === 0)
      );
    })
    .map((r) => {
      const lat = Number(r.Latitude);
      const lng = Number(r.Longitude);

      const groupValue = column ? String(r?.[column] ?? "").trim() : "";
      const color = groupValue ? (colorByValue[groupValue] ?? "#64748b") : "#64748b";

      return {
        id: crypto.randomUUID(),
        name: r.City,
        lat,
        lng,
        value: emissionValueForRow(r, emissionType),
        City: r.City,
        CompanyName: r["Company Name"],
        StateOrProvince: r["State or Province"],
        Industry: r.Industry,
        Conglomerate: r.Conglomerate,
        DecarbPlan: r["Decarbonization Plan"],
        groupValue,
        color,
      };
    });
}

function FitBounds({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 8, {
        animate: true,
      });
      return;
    }

    const bounds = L.latLngBounds(
      locations.map((loc) => [loc.lat, loc.lng])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      animate: true,
    });
  }, [locations, map]);

  return null;
}

function calculateCenter(locations) {
  if (!locations.length) return [13.736717, 100.523186];
  const avgLat =
    locations.reduce((sum, loc) => sum + loc.Latitude, 0) / locations.length;

  const avgLng =
    locations.reduce((sum, loc) => sum + loc.Longitude, 0) / locations.length;

  return [avgLat, avgLng];
}


export default function MapTab2({ dark, rows, emissionType, onPointClick, analysisDimension }) {
  const thailandLocations = useMemo(
    () => setLocation(rows, emissionType, analysisDimension),
    [rows, emissionType, analysisDimension]
  );
  const center = calculateCenter(rows)

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="sm:w-full h-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ">
      <MapContainer center={center} zoom={9} scrollWheelZoom className="w-full h-full">
        <TileLayer
          key={dark ? "dark-tiles" : "light-tiles"}   // IMPORTANT: forces redraw
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url={tileUrl}
        />
        <FitBounds locations={thailandLocations} />

        {thailandLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createDivIcon(loc.value, loc.color)}
            zIndexOffset={loc.Conglomerate === "PTT Entity" ? 1000 : 0}
            eventHandlers={{
              click: () => {
                if (!onPointClick) return;

                onPointClick({
                  // these keys must match FILTERS_CONFIG ids:
                  city: loc.City ?? "All",
                  company: loc.CompanyName ?? "All",
                  state: loc.StateOrProvince ?? "All",
                  entity: loc.Conglomerate ?? "All",
                  decarbPlan: loc.DecarbPlan ?? "All",
                  sector: loc.Industry ?? "All",
                });
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{loc.name}</div>
                <div className="text-slate-600 dark:text-slate-300">
                  {analysisDimension}: {loc.groupValue || "Unknown"}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}