import { listenerCount } from "process";
import { toInt } from "../../lib/helpers";

type coordinates = {
  x: number,
  y: number,
}

type fold = {
  direction: 'x' | 'y'
  value: number
}

export function getInstruction(_input: string[]): {} {
  let coordinates = [] as coordinates[]
  let folds = [] as fold[]

  _input.forEach(el => {
    if (el === '') return;

    if (el.startsWith('fold')) {
      let [direction, value] = el.replace('fold along', '').split('=')
      folds.push({direction: direction as 'x'|'y', value: toInt(value)})
    } else {
      let [x, y] = el.split(',').map(Number)
      coordinates.push({x,y})
    }
  })

  return {coordinates, folds}
}

export function one(_input: string[]): number {
  const instruction = getInstruction(_input)

  console.log(instruction)
  return 0;
}

export function two(_input: string[]): number {
  return 0;
}
