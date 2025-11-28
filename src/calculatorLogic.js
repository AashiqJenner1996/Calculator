// calculatorLogic.js

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

export function add(a, b) {
  return normaliseNumber(a) + normaliseNumber(b);
}

export function subtract(a, b) {
  return normaliseNumber(a) - normaliseNumber(b);
}

export function multiply(a, b) {
  return normaliseNumber(a) * normaliseNumber(b);
}

export function divide(a, b) {
  const divisor = normaliseNumber(b);
  if (divisor === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return normaliseNumber(a) / divisor;
}

export function power(a) {
  const n = normaliseNumber(a);
  return n * n;
}

export function squareRoot(a) {
  const n = normaliseNumber(a);
  if (n < 0) {
    throw new Error("Cannot take square root of a negative number");
  }
  return Math.sqrt(n);
}

// Easter egg should NEVER throw - it should just quietly return null if input is not numeric
export function EasterEgg(raw) {
  const num = Number(raw);
  if (Number.isNaN(num)) {
    return null;
  }

  if (num === 666) return "You have summoned an evil spirit";
  if (num === 420) return "OH BAYBE A TRIPLE!";
  if (num === 67) return "I am too old to understand this one, sorry";

  return null;
}

// percent of base
export function percentage(base, percent) {
  const baseNum = normaliseNumber(base);
  const percentNum = normaliseNumber(percent);
  return baseNum * (percentNum / 100);
}
