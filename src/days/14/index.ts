type insertionRulesByPairs = {
  [key: string]: string[]
}

type newInsertedElementsByPairs = {
  [key: string]: string
}

interface polymerInput {
  polymerTemplate: string[],
  insertionRulesByPairs: insertionRulesByPairs,
  newInsertedElementsByPairs: newInsertedElementsByPairs,
}

type occurence = {
  [key: string]: number
}

// transformInput to desired object
function transformInput(_input: string[]): polymerInput {
  let polymerTemplate = _input.shift()!.split('');

  // removing extra empty string
  _input.shift();

  let insertionRulesByPairs: insertionRulesByPairs = {}

  let newInsertedElementsByPairs: newInsertedElementsByPairs = {}

  const inputForRules = _input.map(s => s.split('->'))
  inputForRules.forEach(rule => {
                          const pair: string = rule[0].trim()
                          const addition: string = rule[1].trim()
                          newInsertedElementsByPairs[pair] = addition;
                          insertionRulesByPairs[pair] = [pair[0] + addition, addition + pair[1]]
                        })

  return {polymerTemplate: polymerTemplate, 
          insertionRulesByPairs: insertionRulesByPairs,
          newInsertedElementsByPairs: newInsertedElementsByPairs,
        }
}

//function only works for first Part
function polymerSimulator(polymerTemplate: string[], insertionRules: newInsertedElementsByPairs, step: number):occurence {
  
  //simulating each step
  for (let s = 0; s < step; s++) {
    // creating new polymer chain
    let newPolymer: string[] = [];
    newPolymer.push(polymerTemplate[0])

    for (let i = 1; i < polymerTemplate.length; i++) {
      const currentChain = polymerTemplate[i-1] + polymerTemplate[i]
      const newInsertionEl = insertionRules[currentChain]
      newPolymer.push(newInsertionEl)
      newPolymer.push(polymerTemplate[i])
    }
    polymerTemplate = newPolymer;
  }

  const initialPolymers = Array.from(new Set(polymerTemplate))

  const counter: occurence = {}

  initialPolymers.forEach((el) => counter[el] = polymerTemplate.filter(s => el === s).length)

  return counter;
}

//function works for both parts
function polymerSimulator2(
  polymerTemplate: string[],
  newInsertedElementsByPairs: newInsertedElementsByPairs,
  insertionRulesByPairs: insertionRulesByPairs,
  step: number
): occurence {

  //counting occurence for each pair
  let occurence: occurence = {}

  for (let i = 1; i < polymerTemplate.length; i++) {
    const currentCombi = polymerTemplate[i-1] + polymerTemplate[i]
    occurence[currentCombi] ? occurence[currentCombi]++ : occurence[currentCombi] = 1;
  }

  //counting occurence for each element
  const counterForEachElement: occurence = polymerTemplate.reduce((final : occurence, current) => {
    final[current] ? final[current]++ : final[current] = 1;
    return final
  }, {})

  //simulating each step
  for (let s = 0; s < step; s++) {
    const newOccurence: occurence = {};

    Object.keys(occurence).forEach(p => {
      //defining which new element should be inserted
      const newElInPolymer = newInsertedElementsByPairs[p]
      //finding the two combinations for insertion based on rules
      const [firstChain, secondChain] = insertionRulesByPairs[p]

      //checking whether this element already existed or no, then counting the element
      counterForEachElement[newElInPolymer] ? counterForEachElement[newElInPolymer] += occurence[p] : counterForEachElement[newElInPolymer] = 1

      //checking whether first combination already existed or no, then counting the pair
      newOccurence[firstChain] ? newOccurence[firstChain] += occurence[p] : newOccurence[firstChain] = occurence[p]

      //checking whether second combination already existed or no, then counting the pair
      newOccurence[secondChain] ? newOccurence[secondChain] += occurence[p] : newOccurence[secondChain] = occurence[p]

    })

    //updating occurence object since polymer chain is increased
    occurence = newOccurence;
  }

  return counterForEachElement
}


export function one(_input: string[]): number {

  let {polymerTemplate, newInsertedElementsByPairs} = transformInput(_input)

  const polymerCounter = polymerSimulator(polymerTemplate, newInsertedElementsByPairs, 10)

  const occurence = Object.keys(polymerCounter).map(key => polymerCounter[key])

  const mostOccured = Math.max(...occurence);

  const leastOccured = Math.min(...occurence)

  return mostOccured - leastOccured;
}


export function two(_input: string[]): number {
  let {polymerTemplate, insertionRulesByPairs, newInsertedElementsByPairs} = transformInput(_input);

  const counterForEachElement = polymerSimulator2(polymerTemplate, newInsertedElementsByPairs, insertionRulesByPairs,  40)

  const elementCounter = Object.keys(counterForEachElement).map(key => counterForEachElement[key])

  const mostOccured = Math.max(...elementCounter);

  const leastOccured = Math.min(...elementCounter)

  return mostOccured - leastOccured;
}
