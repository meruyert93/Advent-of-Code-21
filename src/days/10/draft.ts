export function one(_input: string[]): number {
  const input = _input.map(line => line.split(','))
                      .map(arr => arr.map(
                        s => s.split('')
                      ))
                      .flat()

                      
  type bracketCounter = {
    [key: number] : {
      [key: string]: number
    }
  }

  type illegalBrackets = {
    [key: string]: number
  }

  const bracketCounter: bracketCounter = {}

  const illegalBrackets = {
    ')': 0,
    ']': 0,
    '}': 0,
    '>': 0,
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const bracketType = input[i][j];
      switch(bracketType) {
        case `${bracketType}`:
          if(bracketCounter.hasOwnProperty(i)) {
            bracketCounter[i].hasOwnProperty(bracketType) ? bracketCounter[i][bracketType]++ : bracketCounter[i][bracketType] = 1;
          
          } else {
            bracketCounter[i] = {}
            bracketCounter[i][bracketType] = 1;
          }
          break;
      }
    }
  }
  console.log(input)
  console.log(bracketCounter);
  return 0;
}
