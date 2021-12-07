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

// The "mean" is the average value in the list of numbers
function mean(numbers: number[]) {
  const sum = numbers.reduce((a,b) => a+b);
  const average = sum/numbers.length
  return Math.min(Math.floor(average), Math.ceil(average));
}

export function one(_input: string[]): number {
  const input: number[] = transformInput(_input)

  const medianNum: number = median(input);

  const fuelConsumption: number[] = input.map(n => Math.abs(n - medianNum))

  const totalFuel: number = fuelConsumption.reduce((a,b) => a + b)

  return totalFuel;
}

export function two(_input: string[]): number {
  const input: number[] = transformInput(_input);

  const meanNum: number = mean(input);

  const differenceArr: number[] = input.map(n => Math.abs(n - meanNum))

  const triangleNumArr: number[] = differenceArr.map(n => Math.ceil((n*n + n)/2))
  
  const sum = triangleNumArr.reduce((a,b) => a + b)
  return sum;
}
