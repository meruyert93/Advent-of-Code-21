import { toInt } from "../../lib/helpers";

type MemoryMap = Map<number, number[]>;
type Memory = {
  last: number;
  map: MemoryMap;
};

function parseInput(input: string[]): number[] {
  return input[0].split(",").map(toInt);
}

function getMemory(numbers: number[]): Memory {
  const map: MemoryMap = new Map();
  let last = 0;

  numbers.forEach((num, i) => {
    last = num;
    map.set(num, [i]);
  });

  return { last, map };
}

function updateMemory(memory: MemoryMap, value: number, turn: number) {
  if (!memory.has(value)) {
    memory.set(value, [turn]);
  } else {
    const current = memory.get(value) as number[];
    const lastItem = current[current.length - 1];
    memory.set(value, [lastItem, turn]);
  }
}

function play(turns: number, input: string[]) {
  const memory = getMemory(parseInput(input));

  for (let i = memory.map.size; i < turns; i += 1) {
    const { last, map } = memory;
    const turn = i;

    let speaks = 0;

    if (map.has(last)) {
      const curr = map.get(last) as number[];
      if (curr.length === 1) {
        speaks = 0;
      } else {
        speaks = curr[1] - curr[0];
      }
    } else {
      speaks = 0;
    }

    updateMemory(memory.map, speaks, turn);
    memory.last = speaks;
  }

  return memory.last;
}

export function one(input: string[]) {
  return play(2020, input);
}

export function two(input: string[]) {
  return play(30000000, input);
}
