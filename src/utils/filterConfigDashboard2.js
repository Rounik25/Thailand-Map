// utils/filterConfigDashboard2.js
export const FILTERS_CONFIG_DASHBOARD2 = [
  // Example: options come from a "Master" sheet
  { id: "decarbLever", label: "Decarbonization Lever", source: { sheet: "D2_V1", column: "Decarbonization Lever" } },
  { id: "technology", label: "Technology", source: { sheet: "D2_V1", column: "Technology" } },
  { id: "conglomerate", label: "Conglomerate", source: { sheet: "Industries and PP Factbase", column: "Conglomerate" } },
  { id: "industry", label: "Industry", source: { sheet: "Industries and PP Factbase", column: "Industry" } },
  { id: "decarbPlan", label: "Decarbonization Plan", source: { sheet: "Industries and PP Factbase", column: "Decarbonization Plan" } },
  { id: "state", label: "State or Province", source: { sheet: "Industries and PP Factbase", column: "State or Province" } },
  { id: "city", label: "City", source: { sheet: "Industries and PP Factbase", column: "City" } },
  { id: "company", label: "Company Name", source: { sheet: "Industries and PP Factbase", column: "Company Name" } },
];