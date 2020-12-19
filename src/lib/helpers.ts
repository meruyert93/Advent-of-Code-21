export function toInt(str: string): number {
  return Number.parseInt(str, 10);
}

export function range(size: number): number[] {
  return [...Array(size).keys()];
}