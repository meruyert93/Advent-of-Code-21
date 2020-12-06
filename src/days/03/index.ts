function treeCounter(input: string[], step: number, downStep: number): number {
  const gridSize = input[0].length;

  let offset = 0;

  let treeCount = 0;

  for (let i = 0; i < input.length; i += downStep) {
    const current = input[i][offset];
    if (current === "#") {
      treeCount += 1;
    }
    offset =
      offset + step < gridSize ? offset + step : offset + step - gridSize;
  }

  return treeCount;
}

export function one(input: string[]): number {
  return treeCounter(input, 3, 1);
}

export function two(input: string[]) {
  return (
    treeCounter(input, 1, 1) *
    treeCounter(input, 3, 1) *
    treeCounter(input, 5, 1) *
    treeCounter(input, 7, 1) *
    treeCounter(input, 1, 2)
  );
}
