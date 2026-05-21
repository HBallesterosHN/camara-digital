/** Estado del formulario de perfil de miembro (registro público o Mi perfil). */
export type MemberProfileFormState = {
  fullName: string;
  company: string;
  position: string;
  email: string;
  whatsapp: string;
  department: string;
  municipality: string;
  linkedin: string;
  website: string;
  expertiseAreas: string[];
  contributionTypes: string[];
  professionalSummary: string;
  committeeContribution: string;
  committeeExpectation: string;
  consent: boolean;
};

export function emptyMemberProfileFormState(overrides?: Partial<MemberProfileFormState>): MemberProfileFormState {
  return {
    fullName: "",
    company: "",
    position: "",
    email: "",
    whatsapp: "+504 ",
    department: "",
    municipality: "",
    linkedin: "",
    website: "",
    expertiseAreas: [],
    contributionTypes: [],
    professionalSummary: "",
    committeeContribution: "",
    committeeExpectation: "",
    consent: false,
    ...overrides,
  };
}
