import { CONTRIBUTION_TYPES, EXPERTISE_AREAS, HONDURAS_DEPARTMENTS } from "@/lib/constants";
import { normalizeCommitteeEmail } from "@/lib/committee-access";
import { isCompleteHnWhatsapp, normalizeHnWhatsappForStorage } from "@/lib/hn-whatsapp";
import { isMunicipalityInDepartment } from "@/lib/honduras-municipalities";

const ALLOWED_DEPARTMENTS = new Set<string>(HONDURAS_DEPARTMENTS as unknown as string[]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidateMemberBodyOptions = {
  /** Correo tomado solo de la sesión; el cuerpo no puede redefinir el propietario del perfil. */
  emailFromSession?: string | null;
};

export type CreateMemberBody = {
  fullName: string;
  company: string;
  position: string;
  email: string;
  whatsapp: string;
  department: string;
  municipality: string;
  linkedin?: string | null;
  website?: string | null;
  expertiseAreas: string[];
  contributionTypes: string[];
  /** Opcional; puede quedar vacío. */
  professionalSummary: string;
  /** Opcional; puede quedar vacío. */
  committeeContribution: string;
  /** Opcional; puede quedar vacío. */
  committeeExpectation: string;
  consent: boolean;
};

export function validateCreateMemberBody(
  raw: unknown,
  options?: ValidateMemberBodyOptions,
): { ok: true; data: CreateMemberBody } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Cuerpo inválido" };
  }

  const b = raw as Record<string, unknown>;

  const fullName = typeof b.fullName === "string" ? b.fullName.trim() : "";
  const company = typeof b.company === "string" ? b.company.trim() : "";
  const position = typeof b.position === "string" ? b.position.trim() : "";
  const sessionEmail = normalizeCommitteeEmail(
    typeof options?.emailFromSession === "string" ? options.emailFromSession : null,
  );
  const email = sessionEmail ?? (typeof b.email === "string" ? b.email.trim().toLowerCase() : "");
  const whatsapp = typeof b.whatsapp === "string" ? b.whatsapp.trim() : "";
  const department = typeof b.department === "string" ? b.department.trim() : "";
  const municipality = typeof b.municipality === "string" ? b.municipality.trim() : "";
  const linkedin = typeof b.linkedin === "string" && b.linkedin.trim() ? b.linkedin.trim() : null;
  const website = typeof b.website === "string" && b.website.trim() ? b.website.trim() : null;
  const professionalSummary = typeof b.professionalSummary === "string" ? b.professionalSummary.trim() : "";
  const committeeContribution = typeof b.committeeContribution === "string" ? b.committeeContribution.trim() : "";
  const committeeExpectation = typeof b.committeeExpectation === "string" ? b.committeeExpectation.trim() : "";
  const consent = b.consent === true;

  const expertiseAreas = Array.isArray(b.expertiseAreas)
    ? b.expertiseAreas.filter((x): x is string => typeof x === "string").map((x) => x.trim())
    : [];
  const contributionTypes = Array.isArray(b.contributionTypes)
    ? b.contributionTypes.filter((x): x is string => typeof x === "string").map((x) => x.trim())
    : [];

  if (!fullName || fullName.length < 3) {
    return { ok: false, error: "El nombre completo es obligatorio (mínimo 3 caracteres)." };
  }
  if (!company) {
    return { ok: false, error: "La empresa u organización es obligatoria." };
  }
  if (!position) {
    return { ok: false, error: "El cargo es obligatorio." };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "El correo electrónico no es válido." };
  }
  if (!whatsapp || !isCompleteHnWhatsapp(whatsapp)) {
    return { ok: false, error: "Ingrese un WhatsApp válido: +504 seguido de 8 dígitos (móvil)." };
  }
  if (!department) {
    return { ok: false, error: "El departamento es obligatorio." };
  }
  if (!ALLOWED_DEPARTMENTS.has(department)) {
    return { ok: false, error: "Departamento no válido." };
  }
  if (!municipality || municipality.length < 2) {
    return { ok: false, error: "El municipio es obligatorio." };
  }
  if (!isMunicipalityInDepartment(department, municipality)) {
    return { ok: false, error: "El municipio no corresponde al departamento seleccionado." };
  }
  if (expertiseAreas.length === 0) {
    return { ok: false, error: "Seleccione al menos un área de experiencia." };
  }
  if (contributionTypes.length === 0) {
    return { ok: false, error: "Seleccione al menos un tipo de aporte." };
  }
  if (!consent) {
    return { ok: false, error: "Debe marcar la autorización para el uso interno de la información conforme al aviso de consentimiento." };
  }

  const allowedExpertise = new Set<string>(EXPERTISE_AREAS as unknown as string[]);
  for (const a of expertiseAreas) {
    if (!allowedExpertise.has(a)) {
      return { ok: false, error: "Área de experiencia no permitida." };
    }
  }

  const allowedContribution = new Set<string>(CONTRIBUTION_TYPES as unknown as string[]);
  for (const c of contributionTypes) {
    if (!allowedContribution.has(c)) {
      return { ok: false, error: "Tipo de aporte no permitido." };
    }
  }

  if (linkedin) {
    try {
      const u = new URL(linkedin.startsWith("http") ? linkedin : `https://${linkedin}`);
      if (!["http:", "https:"].includes(u.protocol)) {
        return { ok: false, error: "URL de LinkedIn no válida." };
      }
    } catch {
      return { ok: false, error: "URL de LinkedIn no válida." };
    }
  }

  if (website) {
    try {
      const u = new URL(website.startsWith("http") ? website : `https://${website}`);
      if (!["http:", "https:"].includes(u.protocol)) {
        return { ok: false, error: "URL del sitio web no válida." };
      }
    } catch {
      return { ok: false, error: "URL del sitio web no válida." };
    }
  }

  return {
    ok: true,
    data: {
      fullName,
      company,
      position,
      email,
      whatsapp: normalizeHnWhatsappForStorage(whatsapp),
      department,
      municipality,
      linkedin,
      website,
      expertiseAreas,
      contributionTypes,
      professionalSummary,
      committeeContribution,
      committeeExpectation,
      consent,
    },
  };
}
