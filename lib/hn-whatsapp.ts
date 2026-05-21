/** Honduras country code without + */
const CC = "504";
/** Mobile digits after country code */
const LOCAL_LEN = 8;

/**
 * Extrae solo los 8 dígitos locales (tras 504) a partir de lo que el usuario escribió o pegó.
 */
export function hnWhatsappLocalDigits(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.startsWith(CC)) d = d.slice(CC.length);
  return d.slice(0, LOCAL_LEN);
}

/**
 * Valor de input con prefijo fijo +504 y formato legible `+504 1234-5678`.
 */
export function formatHnWhatsappDisplay(input: string): string {
  const local = hnWhatsappLocalDigits(input);
  if (local.length === 0) return "+504 ";
  if (local.length <= 4) return `+504 ${local}`;
  return `+504 ${local.slice(0, 4)}-${local.slice(4)}`;
}

/** true si hay 8 dígitos locales (WhatsApp móvil típico en HN). */
export function isCompleteHnWhatsapp(input: string): boolean {
  return hnWhatsappLocalDigits(input).length === LOCAL_LEN;
}

/**
 * Cadena normalizada para guardar (espacio tras +504, guion en el medio).
 */
export function normalizeHnWhatsappForStorage(input: string): string {
  const local = hnWhatsappLocalDigits(input);
  if (local.length !== LOCAL_LEN) return formatHnWhatsappDisplay(input).trimEnd();
  return `+504 ${local.slice(0, 4)}-${local.slice(4)}`;
}
