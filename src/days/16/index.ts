import { toInt } from "../../lib/helpers";

type Bounds = {
  from: number,
  to: number,
};

type Field = {
  name: string,
  bounds: Bounds[],
}

type Ticket = number[];

type State = {
  fields: Field[],
  yours: Ticket,
  nearby: Ticket[],
};

function parseField(line: string): Field {
  const pattern = /^(.*): (\d*)-(\d*)* or (\d*)-(\d*)*$/;
  const match = pattern.exec(line);
  if (match == null) throw new Error(`unexpected field ${line}`);

  return {
    name: match[1],
    bounds: [
      { from: toInt(match[2]), to: toInt(match[3]) },
      { from: toInt(match[4]), to: toInt(match[5]) }
    ]
  }
}

function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

function parseTicket(line: string): Ticket {
  return line.split(',').map(toInt);
}

function parseInput(input: string[]): State {
  const state: State = {
    fields: [],
    yours: [],
    nearby: [],
  };

  let currentField: 'fields' | 'yours' | 'nearby' = 'fields';

  input.forEach((line) => {
    if (line === '') return;
    if (line === 'your ticket:') {
      currentField = 'yours';
      return;
    } else if (line === 'nearby tickets:') {
      currentField = 'nearby';
      return;
    }

    if (currentField === 'fields') {
      state.fields.push(parseField(line));
    } else if (currentField === 'yours') {
      state.yours = parseTicket(line);
    } else {
      state.nearby.push(parseTicket(line));
    }
  });

  return state;
}

function toInvalidFields(bounds: Bounds[], ticket: Ticket): number[] {
  const invalid: number[] = [];

  ticket.forEach((id) => {
    const isValid = bounds.some((bound) => id >= bound.from && id <= bound.to );
    if (!isValid) invalid.push(id);
  });

  return invalid;
}

function errorRate(state: State): number {
  const bounds: Bounds[] = state.fields
    .map(x => x.bounds)
    .flat();

  return state.nearby
    .map(ticket => toInvalidFields(bounds, ticket))
    .reduce((acc, curr) => acc + sum(curr), 0);
}

export function one(input: string[]): number {
  const state = parseInput(input);
  return errorRate(state);
}

export function two(input: string[]): number {
  const state = parseInput(input);
  return 0;
}