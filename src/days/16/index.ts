import { toInt } from "../../lib/helpers";

type Bounds = {
  from: number;
  to: number;
};

type Field = {
  name: string;
  bounds: Bounds[];
};

type Ticket = number[];

type State = {
  fields: Field[];
  yours: Ticket;
  nearby: Ticket[];
};

function parseField(line: string): Field {
  const pattern = /^(.*): (\d*)-(\d*)* or (\d*)-(\d*)*$/;
  const match = pattern.exec(line);
  if (match == null) throw new Error(`unexpected field ${line}`);

  return {
    name: match[1],
    bounds: [
      { from: toInt(match[2]), to: toInt(match[3]) },
      { from: toInt(match[4]), to: toInt(match[5]) },
    ],
  };
}

function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

function parseTicket(line: string): Ticket {
  return line.split(",").map(toInt);
}

function parseInput(input: string[]): State {
  const state: State = {
    fields: [],
    yours: [],
    nearby: [],
  };

  let currentField: "fields" | "yours" | "nearby" = "fields";

  input.forEach((line) => {
    if (line === "") return;
    if (line === "your ticket:") {
      currentField = "yours";
      return;
    } else if (line === "nearby tickets:") {
      currentField = "nearby";
      return;
    }

    if (currentField === "fields") {
      state.fields.push(parseField(line));
    } else if (currentField === "yours") {
      state.yours = parseTicket(line);
    } else {
      state.nearby.push(parseTicket(line));
    }
  });

  return state;
}

function inBounds(val: number, bound: Bounds) {
  return val >= bound.from && val <= bound.to;
}

function toBounds(state: State): Bounds[] {
  return state.fields.map((x) => x.bounds).flat();
}

function toInvalidFields(bounds: Bounds[], ticket: Ticket): number[] {
  const invalid: number[] = [];

  ticket.forEach((id) => {
    const isValid = bounds.some((b) => inBounds(id, b));
    if (!isValid) invalid.push(id);
  });

  return invalid;
}

function byValidField(bounds: Bounds[]): (ticket: Ticket) => boolean {
  return (ticket) => toInvalidFields(bounds, ticket).length === 0;
}

function errorRate(state: State): number {
  const bounds = toBounds(state);

  return state.nearby
    .map((ticket) => toInvalidFields(bounds, ticket))
    .reduce((acc, curr) => acc + sum(curr), 0);
}

export function one(input: string[]): number {
  const state = parseInput(input);
  return errorRate(state);
}

function mapPositionToPossibleFields(tickets: Ticket[], fields: Field[]) {
  const positionFieldMapping: Map<number, Field[]> = new Map();

  for (let i = 0; i < tickets[0].length; i += 1) {
    const values = tickets.map((t) => t[i]);

    const names = fields.filter((f) => {
      const matches = values.every((id) =>
        f.bounds.some((b) => inBounds(id, b))
      );
      return matches;
    });

    positionFieldMapping.set(i, names);
  }

  return positionFieldMapping;
}

export function two(input: string[]): number {
  const state = parseInput(input);
  const validTickets = state.nearby.filter(byValidField(toBounds(state)));

  type Acc = {
    blacklist: string[];
    positionNames: [number, string][];
  };

  const possiblePositions = mapPositionToPossibleFields(
    validTickets,
    state.fields
  );

  const { positionNames } = Array.from(possiblePositions.entries())
    .sort((a, b) => {
      const [, aFields] = a;
      const [, bFields] = b;
      return aFields.length - bFields.length;
    })
    .reduce(
      (acc: Acc, curr: [number, Field[]]): Acc => {
        const names = curr[1].filter((x) => !acc.blacklist.includes(x.name));
        const currentName = names[0].name;

        const mapping: [number, string] = [curr[0], currentName];
        return {
          blacklist: [...acc.blacklist, currentName],
          positionNames: [...acc.positionNames, mapping],
        };
      },
      { blacklist: [], positionNames: [] }
    );

  return positionNames
    .filter(([, name]) => name.includes("departure"))
    .reduce((acc, [i]) => acc * state.yours[i], 1);
}
