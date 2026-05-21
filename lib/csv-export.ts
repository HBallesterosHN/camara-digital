/** Escapa un valor para CSV (RFC 4180): comillas dobles internas y envoltura si hace falta. */
export function escapeCsvCell(value: string): string {
  const mustQuote = /[",\n\r]/.test(value);
  const inner = value.replace(/"/g, '""');
  return mustQuote ? `"${inner}"` : inner;
}

export type CsvMemberRow = {
  id: string;
  fullName: string;
  company: string;
  position: string;
  email: string;
  whatsapp: string;
  department: string;
  municipality: string;
  linkedin: string;
  website: string;
  expertiseAreas: string;
  contributionTypes: string;
  professionalSummary: string;
  committeeContribution: string;
  committeeExpectation: string;
  consent: string;
  createdAt: string;
  updatedAt: string;
};

const CSV_HEADERS: (keyof CsvMemberRow)[] = [
  "id",
  "fullName",
  "company",
  "position",
  "email",
  "whatsapp",
  "department",
  "municipality",
  "linkedin",
  "website",
  "expertiseAreas",
  "contributionTypes",
  "professionalSummary",
  "committeeContribution",
  "committeeExpectation",
  "consent",
  "createdAt",
  "updatedAt",
];

export function membersToCsv(members: CsvMemberRow[]): string {
  const headerLine = CSV_HEADERS.join(",");
  const dataLines = members.map((row) =>
    CSV_HEADERS.map((key) => escapeCsvCell(row[key] ?? "")).join(","),
  );
  return [headerLine, ...dataLines].join("\r\n");
}

export function adminMembersToCsvRows(
  members: {
    id: string;
    fullName: string;
    company: string;
    position: string;
    email: string;
    whatsapp: string;
    department: string;
    municipality: string;
    linkedin: string | null;
    website: string | null;
    expertiseAreas: string[];
    contributionTypes: string[];
    professionalSummary: string;
    committeeContribution: string;
    committeeExpectation: string;
    consent: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  }[],
): CsvMemberRow[] {
  return members.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    company: m.company,
    position: m.position,
    email: m.email,
    whatsapp: m.whatsapp,
    department: m.department,
    municipality: m.municipality,
    linkedin: m.linkedin ?? "",
    website: m.website ?? "",
    expertiseAreas: m.expertiseAreas.join("; "),
    contributionTypes: m.contributionTypes.join("; "),
    professionalSummary: m.professionalSummary,
    committeeContribution: m.committeeContribution,
    committeeExpectation: m.committeeExpectation,
    consent: m.consent ? "true" : "false",
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
  }));
}
