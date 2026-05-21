import { HONDURAS_MUNICIPALITIES_BY_DEPARTMENT } from "./honduras-municipalities-data";

const map = HONDURAS_MUNICIPALITIES_BY_DEPARTMENT as unknown as Record<string, readonly string[]>;

/** Municipios del departamento, ordenados alfabéticamente (es). */
export function getMunicipalitiesForDepartment(department: string): string[] {
  const list = map[department];
  if (!list) return [];
  return [...list].sort((a, b) => a.localeCompare(b, "es"));
}

export function isMunicipalityInDepartment(department: string, municipality: string): boolean {
  const list = map[department];
  if (!list) return false;
  return list.includes(municipality);
}
