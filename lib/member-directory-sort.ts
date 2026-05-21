import type { Member } from "@prisma/client";

import { isFoundingReferenceProfile } from "@/lib/demo-profile";

/** Prioriza el perfil de referencia del prototipo y luego ordena por fecha de registro (más reciente primero). */
export function sortMembersForDirectoryDisplay(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    const refA = isFoundingReferenceProfile(a) ? 1 : 0;
    const refB = isFoundingReferenceProfile(b) ? 1 : 0;
    if (refA !== refB) return refB - refA;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
