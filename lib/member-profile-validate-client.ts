import { CONTRIBUTION_TYPES, EXPERTISE_AREAS, HONDURAS_DEPARTMENTS } from "@/lib/constants";
import type { MemberProfileFormState } from "@/lib/member-profile-form-types";
import { isMunicipalityInDepartment } from "@/lib/honduras-municipalities";
import { isCompleteHnWhatsapp } from "@/lib/hn-whatsapp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_DEPARTMENTS = new Set<string>(HONDURAS_DEPARTMENTS as unknown as string[]);

export type ValidateMemberProfileClientOptions = {
  /** Si se indica, no se valida `form.email` (perfil ligado a sesión). */
  fixedEmail?: string;
};

export function validateMemberProfileFormState(
  form: MemberProfileFormState,
  options?: ValidateMemberProfileClientOptions,
): Record<string, string> {
  const e: Record<string, string> = {};
  const emailToCheck = options?.fixedEmail?.trim().toLowerCase() ?? form.email.trim().toLowerCase();

  if (form.fullName.trim().length < 3) e.fullName = "Nombre completo obligatorio (mín. 3 caracteres).";
  if (!form.company.trim()) e.company = "Empresa u organización obligatoria.";
  if (!form.position.trim()) e.position = "Cargo obligatorio.";
  if (!options?.fixedEmail) {
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) e.email = "Correo electrónico no válido.";
  } else if (!EMAIL_RE.test(emailToCheck)) {
    e._form = "Correo de sesión no válido.";
  }
  if (!isCompleteHnWhatsapp(form.whatsapp)) {
    e.whatsapp = "WhatsApp obligatorio: +504 y 8 dígitos (móvil).";
  }
  if (!form.department) e.department = "Seleccione un departamento.";
  else if (!ALLOWED_DEPARTMENTS.has(form.department)) e.department = "Departamento no válido.";
  if (!form.municipality) e.municipality = "Seleccione un municipio.";
  else if (!isMunicipalityInDepartment(form.department, form.municipality)) {
    e.municipality = "Municipio no válido para el departamento elegido.";
  }
  if (form.expertiseAreas.length === 0) e.expertiseAreas = "Seleccione al menos un área.";
  if (form.contributionTypes.length === 0) e.contributionTypes = "Seleccione al menos un tipo de aporte.";
  if (!form.consent) e.consent = "Debe marcar la autorización conforme al aviso de consentimiento.";

  if (form.linkedin.trim()) {
    try {
      const u = new URL(form.linkedin.startsWith("http") ? form.linkedin : `https://${form.linkedin}`);
      if (!["http:", "https:"].includes(u.protocol)) e.linkedin = "URL no válida.";
    } catch {
      e.linkedin = "URL no válida.";
    }
  }
  if (form.website.trim()) {
    try {
      const u = new URL(form.website.startsWith("http") ? form.website : `https://${form.website}`);
      if (!["http:", "https:"].includes(u.protocol)) e.website = "URL no válida.";
    } catch {
      e.website = "URL no válida.";
    }
  }

  const allowedExpertise = new Set<string>(EXPERTISE_AREAS as unknown as string[]);
  for (const a of form.expertiseAreas) {
    if (!allowedExpertise.has(a)) {
      e.expertiseAreas = "Área de experiencia no permitida.";
      break;
    }
  }
  const allowedContribution = new Set<string>(CONTRIBUTION_TYPES as unknown as string[]);
  for (const c of form.contributionTypes) {
    if (!allowedContribution.has(c)) {
      e.contributionTypes = "Tipo de aporte no permitido.";
      break;
    }
  }

  return e;
}
