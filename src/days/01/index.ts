import { toInt } from "../../lib/helpers";

export function one(_input: string[]): number{
  const input = _input.map(toInt);

  let sum: number = 0;
  
  for (let i = 1; i < input.length; i++) {
    const firstVal = input[i]

    const secondVal = input[i-1];

    if (firstVal - secondVal > 0) {
      sum++;
    }

  }

  return sum;
}

export function two(_input: string[]): number{
  const input = _input.map(toInt);

  let result: number;

  let sumArr: Array<number> = []
  
    for (let i = 2; i < input.length; i++) {
      sumArr.push(input[i-2]+input[i-1]+input[i])
    }

    const newInput = sumArr.map(el => String(el));
    
    result = one(newInput);
    return result;
}

  