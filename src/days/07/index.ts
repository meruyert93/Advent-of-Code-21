import { toInt } from "../../lib/helpers";


// transform input to number[]
function transformInput(_input: string[]): number[] {
  const input = _input
                      .map(n=>n.split(','))
                      .flat()
                      .map(toInt)

  return input;
}


// The "median" is the "middle" value in the list of numbers.

function median(numbers: number[]){
  if(numbers.length ===0) throw new Error("No inputs");
  numbers.sort((a,b) => a - b);

  let half = Math.floor(numbers.length / 2);
  
  if (numbers.length % 2) return numbers[half];
  
  return (numbers[half - 1] + numbers[half]) / 2.0;
}

export function one(_input: string[]): number {
  const input = transformInput(_input)

  const medianNum = median(input);

  const fuelConsumption = input.map(n => Math.abs(n - medianNum))

  const totalFuel = fuelConsumption.reduce((a,b) => a + b)

  return totalFuel;
}

export function two(_input: string[]): number {
  return 0;
}
