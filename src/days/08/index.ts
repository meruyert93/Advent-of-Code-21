  interface display {
    signalPatterns: string[],
    digitalOutputs: string[],
  }[]

  function transformInput(_input: string[]): display[] {
    const displayResult: display[] = _input.map(entry => {
      const [signalPatterns, digitalOutputs ] = entry.split('|')
      return {
        signalPatterns: signalPatterns.trim()
                                      .split(' ')
                                      .map(
                                        str => str.split('').sort((a,b) => a.localeCompare(b)).join('')
                                      ),
        digitalOutputs: digitalOutputs.trim()
                                      .split(' ')
                                      .map(
                                        str => str.split('').sort((a,b) => a.localeCompare(b)).join('')
                                      ),
      }  
    })
    return displayResult;
  }


export function one(_input: string[]): number {
  const display = transformInput(_input)

  // size of the segments for unique numbers such as 1, 4, 7 and 8 respectively
  const segmentsSizeForUniqueNums: number[] = [2, 4, 3, 7]; 

  let occurenceCounter: number = 0;

  display.map(
    obj => obj.digitalOutputs.map(
      string => segmentsSizeForUniqueNums.includes(string.length) ? occurenceCounter += 1 : occurenceCounter
    )
  )

  return occurenceCounter;
}

// export function two(_input: string[]): number {
//   const display = transformInput(_input)

//   let signalPattern = {
//     acedgfb: 8,
//     cdfbe: 5,
//     gcdfa: 2,
//     fbcad: 3,
//     dab: 7,
//     cefabd: 9,
//     cdfgeb: 6,
//     eafb: 4,
//     cagedb: 0,
//     ab: 1,
//   }

//   const sortedSignalPattern: any = {}

//   for (const [key, value] of Object.entries(signalPattern)) {
//     const newKey = key.split('').sort((a,b) => a.localeCompare(b)).join('')
//     sortedSignalPattern[newKey] = value
//   }

//   const numbers = display.map(
//     obj => obj.digitalOutputs.map(
//       string => {
//         for (const [key, value] of Object.entries(sortedSignalPattern)) {
//           if(string === key) {
//             return value
//           }
//         }
//       }
//     )
//   )
  

//   console.log(sortedSignalPattern)

//   console.log(display)

//   console.log(numbers)
//   return 0;
// }