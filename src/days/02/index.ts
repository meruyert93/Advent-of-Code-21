
type Constraint = {
  x: number,
  y: number,
  letter: string,
};

function parseLine(line: string): { password: string, constraint: Constraint } {
  const regexp = /^(\d\d?)-(\d\d?)\s(\w):\s(\w*)$/;
  const match = regexp.exec(line);

  if (match == null) throw new Error(`Unexpected input: ${line}`);

  return {
    constraint: {
      x: Number.parseInt(match[1], 10),
      y: Number.parseInt(match[2], 10),
      letter: match[3]
    },
    password: match[4],
  };
}

function countLetter(letters: string[], letter: string): number {
  return letters.filter(x => x === letter).length;
}

export function one(input: string[]): number {
  return input
    .reduce((acc: number, line: string): number => {
      const { constraint, password } = parseLine(line);
      const { x: min, y: max, letter } = constraint;
      // optimization: return if not set
      if (!password.includes(letter)) return acc;

      const letters = password.split('');
      // optimization: return if shorter than min
      if (letters.length < min) return acc;

      const occurences = countLetter(letters, constraint.letter);
      if (occurences < min || occurences > max) return acc;

      return acc + 1;
    }, 0);
}

export function two(input: string[]): number {
  return input
    .reduce((acc: number, line: string): number => {
      const { constraint, password } = parseLine(line);
      const { x: posX, y: posY, letter } = constraint;

      // optimization: return if not set
      if (!password.includes(letter)) return acc;

      const letters = password.split('');
      // optimization: return if constraint higher than string length
      if (letters.length < posX - 1 || letters.length < posY - 1) return acc;

      const matchesY = letter === letters[posY - 1];
      const matchesX = letter === letters[posX - 1];

      if ((matchesX && !matchesY) || (!matchesX && matchesY)) {
        return acc + 1;
      }

      return acc;
    }, 0);
}