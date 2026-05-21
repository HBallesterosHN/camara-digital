/**
 * Solo debe inyectarse URL en el cliente cuando `DATABASE_URL` es Accelerate
 * (`prisma+postgres://`) y existe una URL PostgreSQL directa.
 *
 * Si `DATABASE_URL` ya es `postgresql://`, no pasar `datasources` al construir
 * `PrismaClient`: forzar override con la misma URL puede activar validación del
 * motor HTTP (P6001: exige `prisma+`).
 */
export function getPrismaDatasourceOverrideUrl(): string | undefined {
  const primary = process.env.DATABASE_URL?.trim();
  const direct = process.env.DATABASE_URL_DIRECT?.trim();
  if (primary?.startsWith("prisma+") && direct) {
    return direct;
  }
  return undefined;
}
