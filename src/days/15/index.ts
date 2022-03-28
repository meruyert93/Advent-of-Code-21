import { toInt } from "../../lib/helpers";

export function one(_input: string[]): number {
  const input = _input.map(s => s.split(','))
                      .map(arr => arr.map(
                        s => s.split('').map(n => toInt(n))
                      ))
                      .flat()

                      console.log(input)
const columns: number = input[0].length; 
const rows: number = input.length; 


  return 0;
}

export function two(_input: string[]): number {
  return 0;
}
