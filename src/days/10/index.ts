import { toInt } from "../../lib/helpers";

//needed types
type pairBrackets = {
  [key: string]: string
}

type pointsByBrackets = {
  [key: string]: number
}

type bracketsByLine = {
  [key: number] : string[]
}

// The "median" is the "middle" value in the list of numbers. from day07
function median(numbers: number[]){
  if(numbers.length ===0) throw new Error("No inputs");
  numbers.sort((a,b) => a - b);

  let half = Math.floor(numbers.length / 2);
  
  if (numbers.length % 2) return numbers[half];
  
  return (numbers[half - 1] + numbers[half]) / 2.0;
}

//transform input for needed data format
function transformInput(_input: string[]): string[][] {
  const input = _input.map(line => line.split(','))
                      .map(arr => arr.map(
                        s => s.split('')
                      ))
                      .flat()

  return input;
}


//function to find lines with corruptedbrackets: 
function findLinesWithCorruptedbrackets(input: string[][]):[string[], bracketsByLine] {
  const neededClosedBrackets: string[] = [];

  const pairBrackets: pairBrackets = {
    '[': ']',
    '(': ')',
    '{': '}',
    '<': '>',
  }

  const corruptedBrackets: string[] = [];

  const corruptedBracketsByLine: bracketsByLine = {}

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const currentBracket = input[i][j];
      
      //check if it is openBracket, because openBrackets were set as key
      if (pairBrackets.hasOwnProperty(currentBracket)) {
        
        // if it is open bracket, then we took neededClosedBracket, which is value of coresponsing key
        const neededClosedBracket = pairBrackets[currentBracket]

        //all neededClosedBrackets are stored in the array
        neededClosedBrackets.push(neededClosedBracket)
      } else {

        // if it is not open bracket, then it could be closedbracket, 
        // then, we check if it is the same as last pushed closed bracket
        // if it is the same, then we are good, pairs are removed and we continue further
        // if it is not the same, then it is corrupted bracket! we push it to the correptedBracket arrays, 
        // also we push it to the object corrupsedBracketsByline
        const expectedClosedBracket = neededClosedBrackets.pop()!;
        if (expectedClosedBracket === currentBracket) {

          continue
        } else {
          corruptedBrackets.push(currentBracket)
          corruptedBracketsByLine[i] = []
          corruptedBracketsByLine[i].push(currentBracket)
        }
      }
    }
  }
  return [corruptedBrackets, corruptedBracketsByLine];
}


//solution to part 1
export function one(_input: string[]): number {
  const input = transformInput(_input);

  const pointsByBrackets: pointsByBrackets = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  }

  const [corruptedBrackets] = findLinesWithCorruptedbrackets(input)

  let counter: number = 0;

  //counting the points based on amount of each type of brackets
  Object.keys(pointsByBrackets).forEach(bracket => {
    const numberOfBrackets = corruptedBrackets.filter(b => b === bracket).length;
    counter = counter + numberOfBrackets * pointsByBrackets[bracket];
  })
  return counter;
}



//part two
export function two(_input: string[]): number {
  const input = transformInput(_input);

  const pairBrackets: pairBrackets = {
    '[': ']',
    '(': ')',
    '{': '}',
    '<': '>',
  }

  const pointsByBrackets: pointsByBrackets = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  const incompleteBracketsByLine: bracketsByLine = {}

  const corruptedBracketsByLine = findLinesWithCorruptedbrackets(input)[1]

  const linesWithCorruptedBrackets = Object.keys(corruptedBracketsByLine).map(toInt)

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const currentBracket = input[i][j];

      // since we exclude lines with corrupted brackets, we break here;
      if (linesWithCorruptedBrackets.includes(i)) break;
    
      //check if it is openBracket, because openBrackets were set as key
      if (pairBrackets.hasOwnProperty(currentBracket)) {
        
        // if it is open bracket, then we took neededClosedBracket, which is value of coresponsing key
        const neededClosedBracket = pairBrackets[currentBracket]

        //all neededClosedBrackets are stored in the object by corresponding line number
        if(incompleteBracketsByLine.hasOwnProperty(i)) {
          incompleteBracketsByLine[i] = [...incompleteBracketsByLine[i], neededClosedBracket]
        
        } else {
          incompleteBracketsByLine[i] = []
          incompleteBracketsByLine[i].push(neededClosedBracket)
        }
      } else {

        // if it is not open bracket, then it could be closedbracket, 
        // even closed bracket is not corresponding to the open bracket, we just remove them,
        // because now we don't care about types of bracket, we just remove pairs
        incompleteBracketsByLine[i].pop();
      }
    }
  }

  const incompleteBracketByLineArr = Object.entries(incompleteBracketsByLine)

  //reversing brackets 
  for (const [key, value] of incompleteBracketByLineArr) {
    incompleteBracketsByLine[Number(key)] = value.reverse()
  }

  const pointsForIncompleteBracketsByLine: pointsByBrackets = {}

  for (const [key, value] of incompleteBracketByLineArr) {
    let score = 0;
    for (let i = 0; i < value.length; i++) {
      score = score * 5;
      score = score + pointsByBrackets[value[i]]

      pointsForIncompleteBracketsByLine[key] = score;
    }
  }

  const scores: number[] = Object.values(pointsForIncompleteBracketsByLine)

  const medianNum: number = median(scores)

  return medianNum;
}
