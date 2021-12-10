import { toInt } from "../../lib/helpers";

function getAdjacentNumIndexes(coordinates: number[], rows: number, columns: number): number[][] {
  const [x, y] = coordinates;

  const left = y - 1;
  const right = y + 1;
  const up = x - 1;
  const down = x + 1;

  const adjacentIndexes: number[][] = [];

  if (left >= 0) adjacentIndexes.push([x, left])
  if (right < columns) adjacentIndexes.push([x, right])
  if (up >= 0) adjacentIndexes.push([up, y])
  if (down < rows) adjacentIndexes.push([down, y])

  return adjacentIndexes;
}

function checkIfLowPoint(input: number[][], adjacentIndexes: number[][], currentNum : number): boolean {
  const checker = ([x, y]: number[]) => currentNum >= input[x][y]
  
  return !adjacentIndexes.some(checker)
}

export function one(_input: string[]): number {
  const input = _input.map(s => s.split(','))
                      .map(arr => arr.map(
                        s => s.split('').map(n => toInt(n))
                      ))
                      .flat()

  const columns: number = input[0].length; 
  const rows: number = input.length; 

  let riskCounter: number = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {

      const coordinates: number[] = [i, j]

      const adjacentIndexes = getAdjacentNumIndexes(coordinates, rows, columns)

      const isLowPoint = checkIfLowPoint(input, adjacentIndexes, input[i][j])

      if (isLowPoint) riskCounter += (input[i][j] + 1)
    }
  }

  return riskCounter;
}

export function two(_input: string[]): number {
  return 0;
}
