import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Vite-safe marker icon fix (CDN)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const thailandLocations = [
  { id: 1, name: "Bangkok", lat: 13.7563, lng: 100.5018, value: 120 },
  { id: 2, name: "Chiang Mai", lat: 18.7883, lng: 98.9853, value: 70 },
  { id: 3, name: "Phuket", lat: 7.8804, lng: 98.3923, value: 20 },
  { id: 4, name: "Pattaya", lat: 12.9236, lng: 100.8825, value: 80 },
  { id: 5, name: "Krabi", lat: 8.0863, lng: 98.9063, value: 50 },
  { id: 6, name: "Nakhon Ratchasima", lat: 14.9799, lng: 102.0977, value: 130 },
  { id: 7, name: "Khon Kaen", lat: 16.4419, lng: 102.8350, value: 80 },
  { id: 8, name: "Hat Yai", lat: 7.0084, lng: 100.4747, value: 55 },
  { id: 9, name: "Udon Thani", lat: 17.4138, lng: 102.7870, value: 67 },
  { id: 10, name: "Ayutthaya", lat: 14.3532, lng: 100.5689, value: 110 },
];

function createDivIcon(value) {
  const size = Math.max(20, value * 0.4); // scale logic
  const radius = size / 2;

  return L.divIcon({
    html: `
      <div 
        style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background-color:${value > 100 ? "red" : "blue"};
          opacity:0.75;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:12px;
          font-weight:600;
        ">
        ${value}
      </div>
    `,
    className: "",   // remove default leaflet styles
    iconSize: [size, size],
    iconAnchor: [radius, radius],
  });
}


export function MapDashboard2({ dark }) {
  const center = [13.736717, 100.523186];

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-full overflow-hidden">
      {/* <div className="w-full h-[10%] text-center flex items-start justify-center text-xl font-semibold">
        <p className="p-2 w-full bg-slate-700 text-white rounded-xl">Graphical View</p>
      </div> */}
      <div className="w-full h-[100%] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg ">
        <MapContainer center={center} zoom={5} scrollWheelZoom className="w-full h-full">
          <TileLayer
            key={dark ? "dark-tiles" : "light-tiles"}   // IMPORTANT: forces redraw
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url={tileUrl}
          />

          {thailandLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createDivIcon(loc.value)}
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
    </div>
  );
}