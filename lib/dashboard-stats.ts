import { prisma } from "@/lib/prisma";
import { CONTRIBUTION_TYPES, EXPERTISE_AREAS, HONDURAS_DEPARTMENTS } from "@/lib/constants";

export type DashboardStats = {
  totalMembers: number;
  departmentsRepresented: number;
  municipalitiesRepresented: number;
  topExpertise: { label: string; count: number }[];
  topContributions: { label: string; count: number }[];
  byDepartment: { department: string; count: number }[];
  /** Frase lista para demo ejecutiva */
  executiveInsight: string;
  departmentsWithoutMembers: string[];
  expertiseLowPresence: { label: string; count: number }[];
  /** Tipos de aporte con mayor presencia (hasta 5) */
  strongestContributionTypes: { label: string; count: number }[];
};

function countInArrays(members: { expertiseAreas: string[]; contributionTypes: string[] }[]) {
  const exp = new Map<string, number>();
  const con = new Map<string, number>();

  for (const m of members) {
    for (const a of m.expertiseAreas) {
      exp.set(a, (exp.get(a) ?? 0) + 1);
    }
    for (const c of m.contributionTypes) {
      con.set(c, (con.get(c) ?? 0) + 1);
    }
  }

  const sortTop = (map: Map<string, number>, allowed: readonly string[]) => {
    return allowed
      .map((label) => ({ label, count: map.get(label) ?? 0 }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  return {
    topExpertise: sortTop(exp, EXPERTISE_AREAS as unknown as string[]),
    topContributions: sortTop(con, CONTRIBUTION_TYPES as unknown as string[]),
    expMap: exp,
    conMap: con,
  };
}

function buildExecutiveInsight(params: {
  totalMembers: number;
  deptCount: number;
  munCount: number;
  topExpertise: { label: string; count: number }[];
}): string {
  const { totalMembers, deptCount, munCount, topExpertise } = params;
  if (totalMembers === 0) {
    return "Aún no hay registros en el mapa. Cuando los miembros del comité completen el formulario, esta vista mostrará cobertura territorial y concentración de capacidades en tiempo real, como insumo para la coordinación.";
  }
  const first = topExpertise[0];
  const second = topExpertise[1];
  const focus =
    first && first.count > 0
      ? second && second.count > 0
        ? `las categorías de experiencia con mayor mención en los perfiles son «${first.label}» y «${second.label}».`
        : `la categoría de experiencia con mayor mención en los perfiles es «${first.label}».`
      : "la distribución de experiencias se presenta equilibrada entre varias categorías.";
  return `Se registran ${totalMembers} perfil(es), con cobertura en ${deptCount} departamento(s) y ${munCount} municipio(s) distintos. A nivel de capacidades declaradas, ${focus}`;
}

function expertiseLowPresenceList(
  members: { expertiseAreas: string[] }[],
  expMap: Map<string, number>,
): { label: string; count: number }[] {
  const all = (EXPERTISE_AREAS as readonly string[]).map((label) => ({
    label,
    count: expMap.get(label) ?? 0,
  }));
  const zeros = all.filter((x) => x.count === 0);
  if (zeros.length > 0) {
    return zeros.slice(0, 8);
  }
  if (members.length === 0) return [];
  const max = Math.max(...all.map((x) => x.count), 1);
  const threshold = Math.max(1, Math.floor(max / 2));
  return [...all]
    .filter((x) => x.count > 0 && x.count <= threshold)
    .sort((a, b) => a.count - b.count)
    .slice(0, 6);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const members = await prisma.member.findMany({
    select: {
      department: true,
      municipality: true,
      expertiseAreas: true,
      contributionTypes: true,
    },
  });

  const deptSet = new Set(members.map((m) => m.department));
  const munKey = new Set(members.map((m) => `${m.department}|||${m.municipality}`));

  const byDeptMap = new Map<string, number>();
  for (const m of members) {
    byDeptMap.set(m.department, (byDeptMap.get(m.department) ?? 0) + 1);
  }
  const byDepartment = [...byDeptMap.entries()]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);

  const { topExpertise, topContributions, expMap } = countInArrays(members);

  const departmentsWithoutMembers = (HONDURAS_DEPARTMENTS as readonly string[]).filter((d) => !deptSet.has(d));

  const expertiseLowPresence = expertiseLowPresenceList(members, expMap);

  const strongestContributionTypes = topContributions.slice(0, 5);

  const executiveInsight = buildExecutiveInsight({
    totalMembers: members.length,
    deptCount: deptSet.size,
    munCount: munKey.size,
    topExpertise,
  });

  return {
    totalMembers: members.length,
    departmentsRepresented: deptSet.size,
    municipalitiesRepresented: munKey.size,
    topExpertise,
    topContributions,
    byDepartment,
    executiveInsight,
    departmentsWithoutMembers,
    expertiseLowPresence,
    strongestContributionTypes,
  };
}
