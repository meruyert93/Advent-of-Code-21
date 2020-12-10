import { nextTick } from "process";

type State = {
  ones: number,
  threes: number,
};

function prepareInput(input: string[]): number[] {
  const numbers = input.map(x => Number.parseInt(x, 10));
  numbers.unshift(0);
  numbers.sort((a, b) => a - b);
  const highestAdapter = numbers[numbers.length - 1];
  numbers.push(highestAdapter + 3);
  return numbers;
}

export function one(input: string[]): number {
  const numbers = prepareInput(input);

  const initialState = { ones: 0, threes: 0 };
  const state = numbers.reduce((acc: State, curr: number, i: number, input: number[]): State => {
    if (i === 0) return acc;
    const diff = curr - input[i - 1];
    return diff === 1
      ? { ...acc, ones: acc.ones + 1 }
      : { ...acc, threes: acc.threes + 1 };
  }, initialState);

  return state.ones * state.threes;
}

function findJumpIndex(arr: number[]): number {
  let result = -1;
  for (let i = 0; i < arr.length; i += 1) {
    const val = arr[i];
    const nextVal = arr[i + 1];

    if (!nextVal) {
      result = i;
      return result;
    }

    if (nextVal - val === 3) {
      result = i + 1;
      return result;
    };
  }
  return result;
}

export function two(input: string[]): number {
  const numbers = prepareInput(input);
  return 0;
}
