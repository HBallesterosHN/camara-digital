import type { Member } from "@prisma/client";

export type PublicMember = Pick<
  Member,
  | "id"
  | "fullName"
  | "company"
  | "position"
  | "department"
  | "municipality"
  | "linkedin"
  | "website"
  | "expertiseAreas"
  | "contributionTypes"
  | "professionalSummary"
  | "committeeContribution"
>;

export function toPublicMember(member: Member): PublicMember {
  return {
    id: member.id,
    fullName: member.fullName,
    company: member.company,
    position: member.position,
    department: member.department,
    municipality: member.municipality,
    linkedin: member.linkedin,
    website: member.website,
    expertiseAreas: member.expertiseAreas,
    contributionTypes: member.contributionTypes,
    professionalSummary: member.professionalSummary,
    committeeContribution: member.committeeContribution,
  };
}
