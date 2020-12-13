import { toInt } from "../../lib/helpers";

type Constraint = {
  lines: number[];
  time: number;
};

type ContestConstraint = {
  value: number;
  offset: number;
}[];

function byIsActive(s: string): boolean {
  return s !== "x";
}

function isDeparture(time: number, id: number): boolean {
  return time % id === 0;
}

function findDeparture(
  currentTime: number,
  lines: number[]
): {
  currentTime: number;
  lineId: number;
} {
  const lineId = lines.find((id) => isDeparture(currentTime, id));
  return lineId
    ? { lineId, currentTime }
    : findDeparture(currentTime + 1, lines);
}

export function one(input: string[]) {
  const parseInput = (input: string[]): Constraint => ({
    lines: input[1].split(",").filter(byIsActive).map(toInt),
    time: toInt(input[0]),
  });

  const constraints = parseInput(input);
  const departure = findDeparture(constraints.time, constraints.lines);
  return (departure.currentTime - constraints.time) * departure.lineId;
}

export function two(input: string[]) {
  const lines: ContestConstraint = input[1]
    .split(",")
    .reduce((acc: ContestConstraint, curr: string, i: number) => {
      if (curr === "x") return acc;
      return [...acc, { value: toInt(curr), offset: i }];
    }, []);

  let minStep = 1;
  let departure = 0;

  lines.forEach(({ value, offset }, i) => {
    while (!isDeparture(departure + offset, value)) {
      departure += minStep;
    }

    minStep *= value;
  });

  return departure;
}
