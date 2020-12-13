import { toInt } from "../../lib/helpers";

const TARGET = 2020;
// all gas, too many breaks

export function one(_input: string[]): number {
  const input = _input.map(toInt);
  input.sort((a, b) => a - b);

  let x = 0;

  for (let i = 0; i < input.length; i += 1) {
    const firstVal = input[i];
    const offset = TARGET - firstVal;

    for (let j = input.length - 1; j >= 0; j -= 1) {
      const secondVal = input[j];

      if (firstVal + secondVal === TARGET) {
        x = firstVal * secondVal;
        return x;
        // optimization: iterate backwards for more likely early matches
      } else if (secondVal < offset) {
        break;
      }
    }
  }

  return x;
}

export function two(_input: string[]): number {
  const input = _input.map(toInt);
  input.sort((a, b) => a - b);

  let x = 0;

  for (let i = 0; i < input.length; i += 1) {
    const firstVal = input[i];

    for (let j = 0; i < input.length; j += 1) {
      const secondVal = input[j];
      const intermediarySum = firstVal + secondVal;

      // optimization: break early when branch will never match
      if (intermediarySum > TARGET) {
        break;
      }

      for (let k = 0; k < input.length; k += 1) {
        const thirdVal = input[k];
        const sum = intermediarySum + thirdVal;

        if (sum === TARGET) {
          x = firstVal * secondVal * thirdVal;
          return x;
          // optimization: break early when branch will never match
        } else if (sum > TARGET) {
          break;
        }
      }
    }
  }

  return x;
}
