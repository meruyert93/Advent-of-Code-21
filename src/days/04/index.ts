import { toInt } from "../../lib/helpers";

//transform input
function transformInput(_input: string[]): [number[], number[][]] {
  const drawnNumArr: number[] = _input[0].split(',').map(toInt);
  _input.shift();
  
  const input: number[][] = _input.map(el => el
                                            .split(',')
                                            .map(el => el.replace(/\s+/g,' ').trim())
                                            .map(el => el.split(' ').map(toInt))
                                            .flat()
                                            .filter(el => !Number.isNaN(el))
                                            );
  let bingoMatrix: number [][] = [];
  for (let i = 0; i < input.length; i++) {
    if(input[i].length === 0) {
      //here, it is assumed that bingo has always 5 row and columns
      bingoMatrix.push([...input[i+1], ...input[i+2], ...input[i+3], ...input[i+4], ...input[i+5],])
    }
  }
  return [drawnNumArr, bingoMatrix];
}

class Bingo {
  numbers: number[];
  position: any;
  rows: number[];
  columns: number[];
  isReady: boolean;
  existedNumbers: any;

  constructor(numbers: number[]) {
    this.numbers = numbers;
    this.position = new Map()
    this.rows = Array(5).fill(0)
    this.columns = Array(5).fill(0)
    this.isReady = false;
    this.existedNumbers = new Set();

    for(let i = 0; i <this.numbers.length; i++) {
      const n = this.numbers[i]
      this.position.set(n, {
        row: Math.floor(i/5),
        column: i%5
      })
    }
  }

  showResult() {
    const arr = [];
    for(let i = 0; i < 5; i++) {
      arr.push(this.numbers.slice(i*5, i*5+5))
    }
    console.log(arr.join("\n" + "\n"))
  }

  showMap() {
    for (const i of this.position) {
      console.log(i, this.position.get(i))
    }
  }

  addExistedNumber(num: number) {
    const position = this.position.get(num);
    if (!position) return;
    this.existedNumbers.add(num)
    this.rows[position.row]++;
    this.columns[position.column]++;

    if(this.rows[position.row] === 5 
        || this.columns[position.column] === 5 )  {
          this.isReady = true;
        }
  }

  nonExistedNumbers(): number[] {
    return this.numbers.filter(n => !this.existedNumbers.has(n))
  }
}



export function one(_input: string[]): number | undefined {

  const transformedInput: [number[], number[][]] = transformInput(_input);

  const [drawnNumArr, bingoMatrix] = transformedInput;

  let bingo = bingoMatrix.map(el => new Bingo(el))

  let winningMatrix;
  const alreadyDrawnNumArr: number[] = [];

  for (let i = 0; i < drawnNumArr.length; i++) {

    let done: boolean = false;
    alreadyDrawnNumArr.push(drawnNumArr[i]);

    for(let j = 0; j < bingo.length; j++) {
      bingo[j].addExistedNumber(drawnNumArr[i]);
      if (bingo[j].isReady) {
        done = true;
        winningMatrix = bingo[j]
        break;
      }
    }
    if (done) break;
  }

  const undrawnNums: number[] | undefined = winningMatrix?.nonExistedNumbers();

  const sum: number | undefined = undrawnNums?.reduce((a: number, b: number) => a + b, 0)

  const lastNumber: number | undefined = alreadyDrawnNumArr?.pop()

  let  result: number | undefined;

  if (sum && lastNumber) result = sum * lastNumber
  if (result) return result;
}

export function two(_input: string[]): number | undefined {
  const transformedInput: [number[], number[][]] = transformInput(_input);

  const [drawnNumArr, bingoMatrix] = transformedInput;

  let bingo = bingoMatrix.map(el => new Bingo(el))

  let lastWinningMartix;
  let lastNumber: number | undefined;
  const alreadyDrawnNumArr: number[] = [];

  for (let i = 0; i < drawnNumArr.length; i++) {

    let hasIncompletePart: boolean = false;

    alreadyDrawnNumArr.push(drawnNumArr[i]);

    for(let j = 0; j < bingo.length; j++) {

      if(!bingo[j].isReady) {
        hasIncompletePart = true;
        bingo[j].addExistedNumber(drawnNumArr[i]);
        if (bingo[j].isReady) {
          lastWinningMartix = bingo[j]
          lastNumber = drawnNumArr[i];
        }
      }
    }

    if (!hasIncompletePart) break;
  }

  const undrawnNums: number[] | undefined = lastWinningMartix?.nonExistedNumbers();

  const sum: number | undefined = undrawnNums?.reduce((a: number, b: number) => a + b, 0)

  let  result: number | undefined;

  if (sum && lastNumber) result = sum * lastNumber
  if (result) return result;
}
