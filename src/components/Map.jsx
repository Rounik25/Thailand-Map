import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// Vite-safe marker icon fix (CDN)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createDivIcon(value, entity) {
  const size = ((value * 3000) ** (4 / 10)) // scale logic
  const radius = size / 2;

  return L.divIcon({
    html: `
      <div 
        style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background-color:${entity === "PTT Entity" ? "#dc2626" : "#385697"};
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

function setLocation(rows) {
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

      return {
        id: crypto.randomUUID(),
        name: r.City,
        lat,
        lng,
        value:
          Number(r.Process || 0) +
          Number(r.Fuel || 0) +
          Number(r.Indirect_Electricity || 0),
        Conglomerate: r.Conglomerate,
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


export default function Map({ dark, rows }) {
  const thailandLocations = setLocation(rows)
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
            icon={createDivIcon(loc.value, loc.Conglomerate)}
            zIndexOffset={loc.Conglomerate === "PTT Entity" ? 1000 : 0}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{loc.name}</div>
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