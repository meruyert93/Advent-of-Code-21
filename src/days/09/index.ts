const WINDOW_SIZE = 25;

function getSums(window: number[]): Set<number> {
  const sums = window.reduce((acc: number[], curr: number, i: number) => {
    return [
      ...acc,
      ...window
        .slice(i)
        .filter((x) => x !== curr)
        .map((n) => n + curr),
    ];
  }, []);

  return new Set(sums);
}

export function one(input: string[]) {
  const numbers = input.map((x) => Number.parseInt(x, 10));

  let target = 0;

  for (let i = WINDOW_SIZE; i < numbers.length; i += 1) {
    const sums = getSums(numbers.slice(i - WINDOW_SIZE, i));
    const val = numbers[i];

    if (!sums.has(val)) {
      target = val;
      break;
    }
  }

  return target;
}

function detectRange(
  target: number,
  i: number,
  numbers: number[]
): number | null {
  const val = numbers[i];
  let sum = val;
  let j = i + 1;

  while (sum !== target && j < numbers.length) {
    const currentVal = numbers[j];
    sum = sum + currentVal;
    j += 1;
  }

  if (sum === target) {
    const window = numbers.slice(i, j);
    window.sort((a, b) => a - b);
    return window[0] + window[window.length - 1];
  }

  return null;
}

export function two(input: string[]): number | null {
  const numbers = input.map((x) => Number.parseInt(x, 10));
  const target = one(input);

  let result = null;
  let i = 0;

  while (result == null) {
    i += 1;
    result = detectRange(target, i, numbers);
  }

  return result;
}
