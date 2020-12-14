import { toInt } from "../../lib/helpers";

type Memory = Map<string, string>;

type MaskInstruction = {
  type: "mask";
  value: string;
};

type MemoryInstruction = {
  type: "mem";
  value: number;
  address: number;
};

type Instruction = MaskInstruction | MemoryInstruction;

function parseInput(input: string[]): Instruction[] {
  return input.map((line) => {
    if (line.startsWith("mask")) {
      const mask = line.split("=")[1];
      return { type: "mask", value: mask.trim() };
    }

    const pattern = /^mem\[(\d*)\]\s\=\s(\d*)$/;
    const matches = pattern.exec(line);
    if (matches == null) throw new TypeError(`unexpected input ${line}`);

    return {
      type: "mem",
      value: toInt(matches[2]),
      address: toInt(matches[1]),
    };
  });
}

const toBinary = (value: number): string => value.toString(2).padStart(36, "0");
const fromBinary = (value: string): number => Number.parseInt(value, 2);

function sumMemory(memory: Memory) {
  const values = Array.from(memory.values());
  return values.reduce(
    (acc: number, curr: string): number => acc + fromBinary(curr),
    0
  );
}

function applyMask(bitmask: string, value: string): string {
  return value
    .split("")
    .map((d, i) => {
      const maskVal = bitmask[i];
      if (maskVal !== "X") return maskVal;
      return d;
    })
    .join("");
}

function expandFloating(mask: string, value: string): string[] {
  return value
    .split("")
    .reduce((acc: string[][], curr: string, i: number): string[][] => {
      const val = curr;
      const maskVal = mask[i];

      if (acc.length === 0) {
        return maskVal === "X" ? [["0"], ["1"]] : [[maskVal]];
      }

      if (maskVal === "0") {
        return acc.map((arr) => [...arr, val]);
      } else if (maskVal === "1") {
        return acc.map((arr) => [...arr, "1"]);
      }

      return [
        ...acc.map((arr) => [...arr, "0"]),
        ...acc.map((arr) => [...arr, "1"]),
      ];
    }, [])
    .map((arr) => arr.join(""));
}

export function one(input: string[]) {
  const instructions = parseInput(input);

  const memory: Memory = new Map();
  let mask: string = "";

  instructions.forEach((inst) => {
    if (inst.type === "mask") {
      mask = inst.value;
    } else {
      memory.set(toBinary(inst.address), applyMask(mask, toBinary(inst.value)));
    }
  });

  return sumMemory(memory);
}

export function two(input: string[]) {
  const instructions = parseInput(input);

  const memory: Memory = new Map();
  let mask: string = "";

  instructions.forEach((inst) => {
    if (inst.type === "mask") {
      mask = inst.value;
    } else {
      const addresses = expandFloating(mask, toBinary(inst.address));
      addresses.forEach((addr) => {
        memory.set(addr, toBinary(inst.value));
      });
    }
  });

  return sumMemory(memory);
}
