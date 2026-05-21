/** Identifica el perfil de referencia del prototipo (demo ejecutiva), sin persistir en base de datos. */
export function isFoundingReferenceProfile(member: { fullName: string; company: string }): boolean {
  return member.fullName.trim() === "Héctor Ballesteros" && member.company.trim() === "LiSalud";
}
