import { toInt } from "../../lib/helpers";


export function one(_input: string[]): number {
  const itemLength = _input[0].length;

  //Creating new array that will count '1' in each column
  const counterArr = new Array(itemLength).fill(0);

  //Calculating number of occurance of '1' in each column
  for (let i = 0; i < _input.length; i++) {

    for (let j = 0; j < itemLength; j++) {
      if (_input[i][j] === '1') {
        counterArr[j]++
      }
    }
  }

  // if number of '1' is more than half length of input array, it means it occured the most in this column
  const gammaRateBinary = counterArr.map(el => el > _input.length/2 ? '1' : '0').join('');

  // transforming the result of gammaRate to obtain the epsilonRate
  const epsilonRateBinary = gammaRateBinary
                            .split('')
                            .map(el => String(1-toInt(el))).join('')

  const gammaRateDecimal = parseInt(gammaRateBinary, 2);
  const epsilonRateDecimal = parseInt(epsilonRateBinary, 2)
  
  return gammaRateDecimal*epsilonRateDecimal;
}

const getRating = (input: string[], type: string) => {
  
  let index: number = 0;

  while (input.length > 1) {
    /** here we need to find how many time occured "1" in the 'index' column
     *  then assign the number to counter
     */
    let counter: number = 7;

    /** Then, by using 'counter, we identify whether "1" or "0" occured most in the "index" column.
     *  After that, we assign that value to the variable mostOccuredBit
     */
    let mostOccuredBit: string = '1';

    let filterVal: string;

    /** If the type is oxygen, filterVal will be mostOccuredBit,
     *  if the type is co0, filterVal will be 1 - mostOccuredBit
     */
    if (type === 'oxygen') {
      filterVal =  mostOccuredBit;
    } else if (type === 'co2') {
      filterVal = String(1 - toInt(mostOccuredBit))
    }

    /** then, input array will be just filtered based on 
     * filterVal in the corresponding index of the item
     */
    input = input.filter(el => el[index] === filterVal)

    //increase the index to make calculation for the next column
    index++;
  }

  return input[0]
}


export function two(_input: string[]): number {
  const oxygenRating = getRating(_input, 'oxygen');
  const co2Rating = getRating(_input, 'co2');

  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
}
