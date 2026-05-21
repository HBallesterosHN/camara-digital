export const EXPERTISE_AREAS = [
  "Software",
  "Ecommerce",
  "Marketing Digital",
  "Inteligencia Artificial",
  "Ciberseguridad",
  "Fintech",
  "Educación",
  "Logística",
  "Legal/Fiscal",
  "Finanzas",
  "Ventas",
  "Automatización",
  "Transformación Digital",
  "Otro",
] as const;

export const CONTRIBUTION_TYPES = [
  "Mentorías",
  "Capacitaciones",
  "Networking",
  "Diagnóstico digital",
  "Implementación tecnológica",
  "Charlas",
  "Alianzas",
  "Financiamiento",
  "Apoyo legal/fiscal",
  "Otro",
] as const;

export type ExpertiseArea = (typeof EXPERTISE_AREAS)[number];
export type ContributionType = (typeof CONTRIBUTION_TYPES)[number];

export const HONDURAS_DEPARTMENTS = [
  "Atlántida",
  "Choluteca",
  "Colón",
  "Comayagua",
  "Copán",
  "Cortés",
  "El Paraíso",
  "Francisco Morazán",
  "Gracias a Dios",
  "Intibucá",
  "Islas de la Bahía",
  "La Paz",
  "Lempira",
  "Ocotepeque",
  "Olancho",
  "Santa Bárbara",
  "Valle",
  "Yoro",
] as const;
