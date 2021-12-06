import { toInt } from "../../lib/helpers";


// transform input to number[]
function transformInput(_input: string[]): number[] {
  const input = _input
                      .map(n=>n.split(','))
                      .flat()
                      .map(toInt)

  return input;
}

//function that work only for first task:
function fishSimulator1(input: number[], days: number): number {
  //loop to simulate the days
  for (let d = 0; d < days; d++) {

    // loop to simulate fish growing
    for (let i = 0; i < input.length; i ++) {
      if (input[i] === 0) {
        // it is added 9 instead of 8, because it also decreases by 1 and becomes 8
        input.push(9);
        // 0 is replaced by 7 instead of 6, because it also decreases by 1 and becomes 6
        input[i] = 7;
      }
      input[i]--
    }
  }
  return input.length;
}

// function that will work for both tasks
function fishSimulator2(input: number[], days: number): number {
  //make an array to calculate how many of each kind of fish we have as input
  //then, filling with initial value 0;
  let fishCounter: number[] = new Array(9).fill(0);
  input.forEach(n => fishCounter[n]++)

  for (let d = 0; d < days; d++) {
    const fishesAtZero = fishCounter[0];

    for (let i = 0; i < fishCounter.length - 1; i++) {
      fishCounter[i] = fishCounter[i + 1];
    }

    fishCounter[8] = fishesAtZero;
    fishCounter[6] += fishesAtZero;
  }

  const sum : number = fishCounter.reduce((a: number, b: number) => a + b);
  return sum;
}

export function one(_input: string[]): number {
  const input = transformInput(_input)
  const fishAmount: number = fishSimulator2(input, 80);
  return fishAmount;
}

export function two(_input: string[]): number {
  const input = transformInput(_input)
  return fishSimulator2(input, 256);
}
