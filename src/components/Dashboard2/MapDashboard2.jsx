import { useMapEvents, MapContainer, TileLayer, Marker, useMap, Tooltip } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { useState } from "react";

// marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ResetOnMapClick({ onReset }) {
  useMapEvents({
    click: () => onReset?.(),
  });
  return null;
}

function toNum(v) {
  const n = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function createDivIcon(value, color, { dimmed = false, active = false } = {}) {
  const v = Math.max(0, Number(value) || 0);
  const sizeRaw = (v * 5000) ** (4 / 10);
  const size = Number.isFinite(sizeRaw) && sizeRaw > 8 ? sizeRaw : 10;
  const radius = size / 2;

  const opacity = dimmed ? 0.25 : 1;
  const ring = active ? "0 0 0 1px" : "none"; // subtle glow (optional)

  return L.divIcon({
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background-color:${color};
        opacity:${opacity};
        box-shadow:${ring};
        transition: opacity 150ms ease, box-shadow 150ms ease;
      "
      onmouseover="this.style.border='2px solid black'"
      onmouseout="this.style.border='2px solid transparent'"
      ></div>
    `,
    className: "",
    iconSize: [size, size],
    iconAnchor: [radius, radius],
  });
}

function entityForRow(r) {
  return (r?.Conglomerate ?? r?.Entiry ?? r?.Entity ?? "").toString().trim();
}

function colorForEntity(entity) {
  if (entity === "PTT Entity") return "#cc0000";      // red
  if (entity === "Non-PTT Entity") return "#46647b";  // blue
  return "#64748b";
}

/**
 * Filter + aggregate rows into unique marker points.
 * - Filters by selected lever & emissionType (if provided)
 * - Groups duplicates (company repeated by lever/type) and SUMs Emission
 */
function buildLocationsAggregated(rows, { lever, emissionType }) {
  const LEVER_COL = "Decarbonization Lever";
  const EMISSION_TYPE_COL = "Emission Type";
  const EMISSION_COL = "Emission";          // size value

  const LAT_COL = "Latitude";
  const LNG_COL = "Longitude";

  const COMPANY_COL = "Company Name";
  const CITY_COL = "City";
  const STATE_COL = "State or Province";
  const INDUSTRY_COL = "Industry";
  const PLAN_COL = "Decarbonization Plan";
  const CONGLOMERATE_COL = "Conglomerate"; // may exist; fallback handled

  // 1) filter rows
  const filtered = (rows ?? []).filter((r) => {
    const lat = toNum(r?.[LAT_COL]);
    const lng = toNum(r?.[LNG_COL]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return false;

    const rLever = (r?.[LEVER_COL] ?? "").toString().trim();
    const rType = (r?.[EMISSION_TYPE_COL] ?? "").toString().trim();

    if (lever && lever !== "All" && rLever !== lever) return false;

    // If emissionType === "All", include all types; else exact match
    if (emissionType && emissionType !== "All" && rType !== emissionType) return false;

    return true;
  });

  // 2) aggregate duplicates: group by company + location (and optionally city/state)
  const byKey = new Map();

  for (const r of filtered) {
    const lat = toNum(r?.[LAT_COL]);
    const lng = toNum(r?.[LNG_COL]);

    const company = (r?.[COMPANY_COL] ?? "").toString().trim();
    const city = (r?.[CITY_COL] ?? "").toString().trim();
    const state = (r?.[STATE_COL] ?? "").toString().trim();

    // grouping key: stable identity for a “point”
    const key = `${company}__${city}__${state}__${lat.toFixed(6)}__${lng.toFixed(6)}`;

    const emission = toNum(r?.[EMISSION_COL]);

    if (!byKey.has(key)) {
      const entity = (r?.[CONGLOMERATE_COL] ?? entityForRow(r)).toString().trim();
      byKey.set(key, {
        id: key,
        lat,
        lng,
        value: 0, // will sum
        City: city,
        CompanyName: company,
        StateOrProvince: state,
        Industry: (r?.[INDUSTRY_COL] ?? "").toString().trim(),
        Conglomerate: entity,
        DecarbPlan: (r?.[PLAN_COL] ?? "").toString().trim(),
        color: colorForEntity(entity),
      });
    }

    byKey.get(key).value += emission;
  }

  return Array.from(byKey.values()).filter((loc) => loc.value > 0);
}

function FitBounds({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (!locations.length) return;

    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 8, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
    map.fitBounds(bounds, { padding: [50, 50], animate: true });
  }, [locations, map]);

  return null;
}

export function MapDashboard2({
  dark,
  rows = [],
  emissionType = "All",
  selectedFilters = {},
  onPointClick,
}) {

  const [activeId, setActiveId] = useState(null);
  const locations = useMemo(() => buildLocationsAggregated(rows, { emissionType }), [rows, emissionType]);

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="sm:w-full h-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <MapContainer center={[13.736717, 100.523186]} zoom={6} scrollWheelZoom className="w-full h-full">
        <TileLayer
          key={dark ? "dark-tiles" : "light-tiles"}
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url={tileUrl}
        />

        <ResetOnMapClick onReset={() => setActiveId(null)} />
        <FitBounds locations={locations} />

        {locations.map((loc) => {
          const isActive = activeId === loc.id;
          const isDimmed = activeId !== null && !isActive;

          const isPTT = loc.Conglomerate === "PTT Entity";

          return (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createDivIcon(loc.value, loc.color, { dimmed: isDimmed, active: isActive })}
              zIndexOffset={isPTT ? 1000 : 0}
              eventHandlers={{
                click: (e) => {
                  // prevent map click reset from firing immediately
                  L.DomEvent.stopPropagation(e.originalEvent);

                  // toggle active
                  setActiveId((prev) => (prev === loc.id ? null : loc.id));

                  // optional: still notify parent for filter updates
                  onPointClick?.({
                    city: loc.City ?? "All",
                    company: loc.CompanyName ?? "All",
                    state: loc.StateOrProvince ?? "All",
                    conglomerate: loc.Conglomerate ?? "All",
                    decarbPlan: loc.DecarbPlan ?? "All",
                    industry: loc.Industry ?? "All",
                  });
                },
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent={false}
              >
                <div className="text-sm space-y-1">
                  <div className="font-semibold">{loc.CompanyName || "Unknown"}</div>

                  <div>City: {loc.City || "-"}</div>
                  <div>State: {loc.StateOrProvince || "-"}</div>
                  <div>Conglomerate: {loc.Conglomerate || "-"}</div>
                  <div>Industry: {loc.Industry || "-"}</div>
                  <div>Decarbonization Plan: {loc.DecarbPlan || "-"}</div>
                  <div>Decarbonization Lever: {selectedFilters.decarbLever ?? "All"}</div>
                  <div>Technology: *</div>
                  <div>Emission Type: {selectedFilters.emissionType ?? "All"}</div>

                  <div className="font-medium pt-1">
                    Total Emission: {loc.value.toFixed(2)}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}