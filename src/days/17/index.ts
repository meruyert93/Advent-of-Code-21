import { toInt } from "../../lib/helpers";

type Plane = Map<string, boolean>;
type Point = { x: number, y: number, z: number };

type Bounds = { from: number, to: number };

type PlaneBounds = {
  x: Bounds,
  y: Bounds,
  z: Bounds,
}

function toStr(point: Point) {
  return `${point.z}.${point.y}.${point.x}`;
}

function fromStr(str: string): Point {
  const [z, y, x] = str.split('.');
  return { x: toInt(x), y: toInt(y), z: toInt(z) };
}

function parseInput(input: string[]) {
  const plane: Plane = new Map();
  const z = 0;

  input.forEach((l, y) => {
    l.split('').forEach((c, x) => {
      if (c === '#') {
        const point: Point = { x, y, z };
        const key = toStr(point);
        plane.set(key, true);
      }
    });
  });


  return plane;
}

function isPointActive(plane: Plane): (p: Point) => boolean {
  return (p) => plane.has(toStr(p));
}

function getSurroundingPoints(p: Point): Point[] {
  const { x, y, z } = p;
  return [
    { z, x, y: y + 1 },
    { z, x, y: y - 1 },
    { z, x: x - 1, y },
    { z, x: x - 1, y: y - 1 },
    { z, x: x - 1, y: y + 1 },
    { z, x: x + 1, y },
    { z, x: x + 1, y: y - 1 },
    { z, x: x + 1, y: y + 1 },
  ]
}

function getNextPointState(plane: Plane, p: Point): boolean {
  const isActive = isPointActive(plane);

  const neighbours = [
    { ...p, z: p.z - 1 },
    { ...p, z: p.z + 1 },
    ...getSurroundingPoints(p),
    ...getSurroundingPoints({ ...p, z: p.z - 1 }),
    ...getSurroundingPoints({ ...p, z: p.z + 1 }),
  ];

  const activeNeighbours = neighbours.filter(isActive);
  return isActive(p) ? [2, 3].includes(activeNeighbours.length) : activeNeighbours.length === 3;
}

function getBounds(plane: Plane): PlaneBounds {
  const keys = Array.from(plane.keys());

  const values = keys.map(fromStr);

  const xs = [...values].sort((a, b) => a.x - b.x);
  const ys = [...values].sort((a, b) => a.y - b.y);
  const zs = [...values].sort((a, b) => a.z - b.z);

  return {
    x: { from: xs[0].x - 1, to: xs[xs.length - 1].x + 1 },
    y: { from: ys[0].y - 1, to: ys[ys.length - 1].y + 1 },
    z: { from: zs[0].z - 1, to: zs[zs.length - 1].z + 1 },
  };
}

function cycle(plane: Plane): Plane {
  const nextPlane = new Map(plane.entries());
  const bounds = getBounds(plane);

  for (let z = bounds.z.from; z <= bounds.z.to; z += 1) {
    for (let y = bounds.y.from; y <= bounds.y.to; y += 1) {
      for (let x = bounds.x.from; x <= bounds.x.to; x += 1) {
        const p = { x, y, z };
        const currState = isPointActive(plane)(p);
        const nextState = getNextPointState(plane, p);

        if (!currState && nextState) {
          nextPlane.set(toStr(p), true);
        } else if (currState && !nextState) {
          nextPlane.delete(toStr(p));
        }
      }
    }
  }
  return nextPlane;
}


export function one(input: string[]): number {
  let plane = parseInput(input);

  for (let i = 0; i < 6; i += 1) {
    plane = cycle(plane);
  }

  return plane.size;
}

export function two(inputs: string[]) {

}
