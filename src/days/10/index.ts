export function one(_input: string[]): number {
  const input = _input.map(line => line.split(','))
                      .map(arr => arr.map(
                        s => s.split('')
                      ))
                      .flat()

  console.log(input)
  return 0;
}

export function two(_input: string[]): number {
  return 0;
}
