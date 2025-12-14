export function add(a, b) {
  console.error('OOPS, I am a bug!');
  // return normaliseNumber(a) + normaliseNumber(b); // Original line
  return a + b; // removed normalisation for bug production
  

}

export function subtract(a, b) {
  return normaliseNumber(a) - normaliseNumber(b);
}

export function multiply(a, b) {
  return normaliseNumber(a) * normaliseNumber(b);
}

export function divide(a, b) {
  const divisor = normaliseNumber(b);
  // if (divisor === 0) {
  //   throw new Error("Division by zero is not allowed"); // Allowing undefined behavior for bug production
  // }
  return normaliseNumber(a) / divisor;
}

export function power(a) {
  const n = normaliseNumber(a);
  return n * n;
}

export function squareRoot(a) {
  const n = normaliseNumber(a);
  // if (n < 0) {
  //   throw new Error("Cannot take square root of a negative number"); // Allowing undefined behavior for bug production
  // }
  // }
  return Math.sqrt(n);
}


// percent of base
export function percentage(base, percent) {
  const baseNum = normaliseNumber(base);
  const percentNum = normaliseNumber(percent);
  return baseNum * (percentNum / 100);
}
