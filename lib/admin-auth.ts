export function getAdminPin(): string {
  return (process.env.ADMIN_PIN ?? "").trim();
}

export function isAdminPinConfigured(): boolean {
  return getAdminPin().length > 0;
}

export function isValidAdminPin(pin: string | null | undefined): boolean {
  const expected = getAdminPin();
  const candidate = (pin ?? "").trim();
  if (!expected || !candidate) {
    return false;
  }
  return candidate === expected;
}
