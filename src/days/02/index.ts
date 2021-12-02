import { toInt } from "../../lib/helpers";


export function one(input: string[]): number {
  let horizontalCounter: number = 0;
  let depthCounter: number = 0;

  for(let i = 0; i < input.length; i++) {
    const item: string[] = input[i].split(" ");
    const direction: string = item[0];
    const stepVal: number = toInt(item[1])

    if (direction === 'forward') {
      horizontalCounter += stepVal
    } else if (direction === 'down') {
      depthCounter += stepVal
    } else if (direction === 'up') {
      depthCounter -= stepVal;
    }
  }
  return horizontalCounter*depthCounter;
}

export function two(input: string[]): number {
  let horizontalCounter: number = 0;
  let depthCounter: number = 0;
  let aim: number = 0;

  for(let i = 0; i < input.length; i++) {
    const item: string[] = input[i].split(" ");
    const direction: string = item[0];
    const stepVal: number = toInt(item[1]);

    switch(direction) {
      case "forward":
        horizontalCounter +=stepVal;
        depthCounter = depthCounter + stepVal*aim;
        break;
      case "down":
        aim += stepVal;
        break;
      case "up":
        aim -= stepVal;
        break;
      default:
        break;
    }
  }
  return horizontalCounter*depthCounter;
}
