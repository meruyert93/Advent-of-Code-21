import { toInt } from "../../lib/helpers";

/** First we detecc, then we correcc */
type State = {
  index: number;
  count: number;
  visited: number[];
  exited?: boolean;
  branchCorrected?: boolean;
};

type Instruction = {
  index: number;
  operation: string;
  argument: number;
};

type Rule = (state: State, instruction: Instruction) => State;

type InstructionMap = Map<number, Instruction>;
type RuleMap = Record<string, Rule>;

function parseLine(line: string, index: number): Instruction {
  const [operation, argument] = line.split(" ");
  return {
    operation,
    argument: toInt(argument),
    index,
  };
}

function parseInstructions(input: string[]): InstructionMap {
  const instructions: InstructionMap = new Map();
  input.forEach((line, index) => {
    instructions.set(index, parseLine(line, index));
  });
  return instructions;
}

const rules: RuleMap = {
  acc: (state: State, instruction: Instruction) => ({
    ...state,
    index: state.index + 1,
    count: state.count + instruction.argument,
    visited: [...state.visited, instruction.index],
  }),
  jmp: (state: State, instruction: Instruction) => ({
    ...state,
    index: state.index + instruction.argument,
    visited: [...state.visited, instruction.index],
  }),
  nop: (state: State, instruction: Instruction) => ({
    ...state,
    index: state.index + 1,
    visited: [...state.visited, instruction.index],
  }),
};

function detecc(state: State, instructions: InstructionMap): State {
  const node = instructions.get(state.index) as Instruction;
  if (state.visited.includes(node.index)) return state;

  const rule = rules[node.operation] as Rule;
  return detecc(rule(state, node), instructions);
}

function correcc(state: State, instructions: InstructionMap): State {
  const node = instructions.get(state.index);

  if (state.exited || node == null) {
    return { ...state, exited: true };
  } else if (state.visited.includes(node.index)) {
    return { ...state, exited: false };
  }
  const rule = rules[node.operation] as Rule;

  if (node.operation === "acc" || state.branchCorrected) {
    return correcc(rule(state, node), instructions);
  }

  const correctedRule = rules[node.operation === "nop" ? "jmp" : "nop"] as Rule;
  const correctionState = correcc(
    correctedRule({ ...state, branchCorrected: true }, node),
    instructions
  );

  if (correctionState.exited === true) return correctionState;
  return correcc(rule(state, node), instructions);
}

const defaultState = {
  count: 0,
  index: 0,
  visited: [],
};

export function one(input: string[]): number {
  const instructions: InstructionMap = parseInstructions(input);
  const { count } = detecc({ ...defaultState }, instructions);
  return count;
}

export function two(input: string[]): number {
  const instructions: InstructionMap = parseInstructions(input);
  const { count } = correcc({ ...defaultState }, instructions);
  return count;
}
