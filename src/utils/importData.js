import * as XLSX from "xlsx";

export function parseWorkbookToSheets(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const sheets = {};

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    sheets[sheetName] = XLSX.utils.sheet_to_json(ws, { defval: "" });
  }

  return sheets; // { Master: [...], Locations: [...], Plans: [...] }
}

function norm(s) {
  return (s ?? "").toString().trim();
}

export function sheetToJsonWithTwoHeaders(ws) {
  const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }); // arrays
  if (grid.length < 2) return [];

  const top = grid[0];     // parent headers
  const sub = grid[1];     // sub headers

  // Build flattened keys like "Emissions.Scope1"
  const keys = sub.map((subName, i) => {
    const parent = norm(top[i]);
    const child = norm(subName);

    if (parent && child) return `${parent}.${child}`;
    if (child) return child;      // if no parent
    return parent;                // if no child
  });

  const dataRows = grid.slice(2);
  return dataRows.map((row) => {
    const obj = {};
    keys.forEach((k, i) => {
      if (!k) return;
      obj[k] = row[i];
    });
    return obj;
  });
}