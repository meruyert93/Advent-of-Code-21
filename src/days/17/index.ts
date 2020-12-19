import { range, toInt } from "../../lib/helpers";

type Plane = Map<string, boolean>;
type Point = number[];

type Bounds = { from: number; to: number };
type PlaneBounds = Record<number, Bounds>;

function pointToStr(point: Point) {
  return point.join(".");
}

function pointFromStr(str: string): Point {
  return str.split(".").map(toInt);
}

function parseInput(input: string[], dimensions: number) {
  const plane: Plane = new Map();
  const rest = range(dimensions - 2).map(() => 0);

  input.forEach((l, y) => {
    l.split("").forEach((c, x) => {
      if (c === "#") {
        const point: Point = [x, y, ...rest];
        plane.set(pointToStr(point), true);
      }
    });
  });

  return plane;
}

function isPointActive(plane: Plane): (p: Point) => boolean {
  return (p) => {
    return plane.has(pointToStr(p));
  };
}

function expandRange(ranges: number[][]): Point[] {
  const output: Point[] = [[]];
  return ranges.reduce(
    (a, b: number[]) => a.flatMap((x) => b.map((y) => [...x, y])),
    output
  );
}

function getPointsInPlane(bounds: PlaneBounds): Point[] {
  const values = Object.values(bounds);
  const ranges = values.map(({ from, to }) =>
    range(to - from + 1).map((i) => i + from)
  );
  return expandRange(ranges);
}

function getSurroundingPoints(p: Point): Point[] {
  const ranges = p.map((v) => [v - 1, v, v + 1]);
  return expandRange(ranges).filter((x) => !x.every((v, i) => v === p[i]));
}

function getNextPointState(plane: Plane, p: Point): boolean {
  const isActive = isPointActive(plane);
  const activeNeighbours = getSurroundingPoints(p).filter(isActive);
  return isActive(p)
    ? [2, 3].includes(activeNeighbours.length)
    : activeNeighbours.length === 3;
}

function getBounds(plane: Plane): PlaneBounds {
  const keys = Array.from(plane.keys());
  const values = keys.map(pointFromStr);

  const initialState: PlaneBounds = {};

  return values[0].reduce((acc, _, i) => {
    const iVals = [...values].sort((a, b) => a[i] - b[i]);

    return {
      ...acc,
      [i]: { from: iVals[0][i] - 1, to: iVals[iVals.length - 1][i] + 1 },
    };
  }, initialState);
}

function cycle(plane: Plane): Plane {
  const nextPlane = new Map(plane.entries());
  const bounds = getBounds(plane);

  const points = getPointsInPlane(bounds);

  points.forEach((p) => {
    const currState = isPointActive(plane)(p);
    const nextState = getNextPointState(plane, p);

    if (!currState && nextState) {
      nextPlane.set(pointToStr(p), true);
    } else if (currState && !nextState) {
      nextPlane.delete(pointToStr(p));
    }
  });

  return nextPlane;
}

function solve(input: string[], dimensions: number): number {
  let plane = parseInput(input, dimensions);

  for (let i = 0; i < 6; i += 1) {
    plane = cycle(plane);
  }

  return plane.size;
}

export function one(input: string[]): number {
  return solve(input, 3);
}

export function two(input: string[]) {
  return solve(input, 4);
}
