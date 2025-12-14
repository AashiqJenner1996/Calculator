export function normaliseNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      throw new Error("Value cannot be empty");
    }
    const parsed = Number(trimmed);
    if (Number.isNaN(parsed)) {                         
      throw new Error(`Invalid number: "${value}"`);
    }
    return parsed;
  }
  throw new Error("Unsupported type");
}
