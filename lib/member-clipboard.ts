import type { PublicMember } from "@/lib/member-mapper";

/** Texto plano para compartir en actas, correos institucionales o mensajes internos. */
export function buildMemberClipboardSummary(member: PublicMember): string {
  const lines = [
    `Nombre: ${member.fullName}`,
    `Empresa u organización: ${member.company}`,
    `Cargo: ${member.position}`,
    `Ubicación: ${member.municipality}, ${member.department}`,
    `Áreas de experiencia: ${member.expertiseAreas.join(", ")}`,
    `Aporte declarado al comité (autorreportado): ${member.committeeContribution}`,
  ];
  return lines.join("\n");
}
