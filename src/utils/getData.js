import rawData from "../data/mock-data.json";

export function getLocations() {
  return rawData.locations;
}

export function getTimeSeries() {
  return rawData.timeSeries.records;
}

// --------- helpers for dropdown options ---------

export function getMonthOptions() {
  // Extract unique "YYYY-MM" from records
  const months = new Set(
    rawData.timeSeries.records.map((r) => r.date.slice(0, 7))
  );
  return ["All", ...Array.from(months).sort()];
}

export function getCityOptions() {
  // Locations are cities in your data model
  const cities = rawData.locations.map((l) => l.name).sort();
  return ["All", ...cities];
}

export function getRegionOptions() {
  const regions = new Set(rawData.locations.map((l) => l.region));
  return ["All", ...Array.from(regions).sort()];
}

export function getCategoryOptions() {
  const categories = new Set(rawData.locations.map((l) => l.category));
  return ["All", ...Array.from(categories).sort()];
}

export function getLocationByName(cityName) {
  return rawData.locations.find((l) => l.name === cityName) || null;
}

// --------- main filter function ---------

export function getFilteredData({ month, city, region, category }) {
  // 1) filter locations by city/region/category
  let locs = rawData.locations;

  if (city && city !== "All") {
    locs = locs.filter((l) => l.name === city);
  }
  if (region && region !== "All") {
    locs = locs.filter((l) => l.region === region);
  }
  if (category && category !== "All") {
    locs = locs.filter((l) => l.category === category);
  }

  const allowedLocationIds = new Set(locs.map((l) => l.id));

  // 2) filter time series by month and allowed locations
  let records = rawData.timeSeries.records.filter((r) =>
    allowedLocationIds.has(r.locationId)
  );

  if (month && month !== "All") {
    records = records.filter((r) => r.date.startsWith(month));
  }

  return { records, locations: locs };
}

export function getAggregatedMetrics(records) {
  return records.reduce(
    (acc, curr) => {
      acc.totalSales += curr.salesTHB;
      acc.totalOrders += curr.orders;
      acc.totalFootfall += curr.footfall;
      acc.totalReturns += curr.returns;
      // For stores, you can treat it as "latest" instead of sum.
      // We'll compute avgStores as a simple average:
      acc.sumStores += curr.stores;
      acc.count += 1;
      return acc;
    },
    {
      totalSales: 0,
      totalOrders: 0,
      totalFootfall: 0,
      totalReturns: 0,
      sumStores: 0,
      count: 0,
    }
  );
}


export function getRevenueByRegion(records, locations) {
  // Map locationId -> region
  const regionByLocationId = new Map(locations.map((l) => [l.id, l.region]));

  const totals = new Map(); // region -> revenue

  for (const r of records) {
    const region = regionByLocationId.get(r.locationId) ?? "Unknown";
    totals.set(region, (totals.get(region) || 0) + (r.salesTHB || 0));
  }

  // Recharts expects [{ name, value }]
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}


export function getOrdersVsSalesByDate(records) {
  const grouped = new Map();

  for (const r of records) {
    if (!grouped.has(r.date)) {
      grouped.set(r.date, {
        date: r.date,
        orders: 0,
        salesTHB: 0,
      });
    }

    const current = grouped.get(r.date);
    current.orders += r.orders;
    current.salesTHB += r.salesTHB;
  }

  return Array.from(grouped.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

export function enrichRecordsWithLocation(records, locations) {
  const byId = new Map(locations.map((l) => [l.id, l]));
  return records.map((r) => {
    const loc = byId.get(r.locationId);
    return {
      ...r,
      city: loc?.name ?? r.locationId,
      region: loc?.region ?? "Unknown",
      category: loc?.category ?? "Unknown",
    };
  });
}

// Groups records into months and computes conversion = totalOrders / totalFootfall
export function getMonthlyConversion(records) {
  const byMonth = new Map(); // "YYYY-MM" -> { month, orders, footfall }

  for (const r of records) {
    const month = r.date.slice(0, 7);
    if (!byMonth.has(month)) {
      byMonth.set(month, { month, orders: 0, footfall: 0 });
    }
    const curr = byMonth.get(month);
    curr.orders += r.orders || 0;
    curr.footfall += r.footfall || 0;
  }

  return Array.from(byMonth.values())
    .map((m) => ({
      month: m.month,
      conversionRate: m.footfall > 0 ? m.orders / m.footfall : 0, // 0..1
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}