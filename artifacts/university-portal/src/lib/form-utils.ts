export type FormErrors = Record<string, string>;

/**
 * Validate required fields. Returns an errors object.
 * A field fails if its value is falsy, "none", "0", or blank.
 */
export function validateRequired(
  fields: Record<string, { value: string | number | undefined | null; label: string }>
): FormErrors {
  const errors: FormErrors = {};
  for (const [key, { value, label }] of Object.entries(fields)) {
    const str = String(value ?? "").trim();
    if (!str || str === "none" || str === "0") {
      errors[key] = `${label} is required`;
    }
  }
  return errors;
}

/** Returns true if the errors object has any entries. */
export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Normalise a Select sentinel back to undefined.
 * "none" / "" / "0" → undefined. Numeric strings → number.
 */
export function normalizeId(val: string): number | undefined {
  if (!val || val === "none" || val === "0") return undefined;
  const n = parseInt(val, 10);
  return isNaN(n) ? undefined : n;
}

/** Inline error text component markup helper (returns class string). */
export const fieldError = (err: string | undefined) =>
  err ? `text-xs text-red-500 mt-1` : `hidden`;
