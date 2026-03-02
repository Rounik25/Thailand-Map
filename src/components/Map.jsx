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
  { id: 1, name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { id: 2, name: "Chiang Mai", lat: 18.7883, lng: 98.9853 },
  { id: 3, name: "Phuket", lat: 7.8804, lng: 98.3923 },
  { id: 4, name: "Pattaya", lat: 12.9236, lng: 100.8825 },
  { id: 5, name: "Krabi", lat: 8.0863, lng: 98.9063 },
  { id: 6, name: "Nakhon Ratchasima", lat: 14.9799, lng: 102.0977 },
  { id: 7, name: "Khon Kaen", lat: 16.4419, lng: 102.8350 },
  { id: 8, name: "Hat Yai", lat: 7.0084, lng: 100.4747 },
  { id: 9, name: "Udon Thani", lat: 17.4138, lng: 102.7870 },
  { id: 10, name: "Ayutthaya", lat: 14.3532, lng: 100.5689 },
];


export default function Map({ dark }) {
  const center = [13.736717, 100.523186];

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="sm:w-full sm:h-[50vh] sm:rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm ">
      <MapContainer center={center} zoom={5} scrollWheelZoom className="w-full h-full">
        <TileLayer
          key={dark ? "dark-tiles" : "light-tiles"}   // IMPORTANT: forces redraw
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url={tileUrl}
        />

        {thailandLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
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