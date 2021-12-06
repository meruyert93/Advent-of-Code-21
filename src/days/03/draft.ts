const getRating = (input: string[], variant: string): string => {
  const itemLength = input[0].length;

  let counter: number = 0;

    for (let i = 0; i < itemLength; i++) {
      counter = 0
      let search: string;

      for (let j = 0; j < input.length; j++) {
          if (input[j][i] == "0") {
            counter++
          }
      }
      if (counter > input.length/2) {
          if (variant == "oxygen") {
              search = "0"
          } else {
              search = "1"
          }
      } else {
          if (variant == "oxygen") {
              search = "1"
          } else {
              search = "0"
          }
      }

      for (var j=0; j<input.length; j++) {
          if (input[j][i] != search) {
              input.splice(j, 1)
              j--
          }
      }
      if (input.length === 1) {
          break
      }
  }

  console.log(input[0])
  return input[0];
}