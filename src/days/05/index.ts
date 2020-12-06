function getIntArray(size: number): number[] {
  return Array.apply(null, Array(size)).map((_, i) => i);
}

type Instruction = { row: string[]; seat: string[] };

function getInstruction(str: string): Instruction {
  return {
    row: str.substr(0, str.length - 3).split(""),
    seat: str.substr(str.length - 3).split(""),
  };
}

function resolveInstruction(
  instruction: string[],
  upper: number,
  charLower: string,
  charUpper: string
): number {
  let items = getIntArray(upper);

  instruction.forEach((char) => {
    const splitIdx = items.length / 2;

    if (char === charLower) {
      items = items.slice(0, splitIdx);
    } else if (char === charUpper) {
      items = items.slice(splitIdx);
    }
  });

  return items[0];
}

function getRow(instruction: Instruction, limit: number): number {
  return resolveInstruction(instruction.row, limit, "F", "B");
}

function getSeat(instruction: Instruction, limit: number): number {
  return resolveInstruction(instruction.seat, limit, "L", "R");
}

export function one(input: string[]): number {
  let highestId = 0;

  input.forEach((line) => {
    const instruction = getInstruction(line);
    const row = getRow(instruction, 128);
    const seat = getSeat(instruction, 8);
    const id = row * 8 + seat;
    if (id > highestId) {
      highestId = id;
    }
  });

  return highestId;
}

export function two(input: string[]): number {
  const taken = new Map();

  const isMine = (id: number): boolean => {
    return !taken.has(id) && taken.has(id + 1) && taken.has(id - 1);
  };

  input.forEach((line) => {
    const instruction = getInstruction(line);
    const row = getRow(instruction, 128);
    const seat = getSeat(instruction, 8);
    const id = row * 8 + seat;
    taken.set(id, true);
  });

  let mySeat = 0;

  const seats = getIntArray(128 * 8 + 8);
  const middleSeat = seats.length / 2;
  if (isMine(middleSeat)) return middleSeat;

  for (let i = 0; i < seats.length / 2; i += 1) {
    const seatA = seats[middleSeat + i];
    if (isMine(seatA)) {
      mySeat = seatA;
      break;
    }
    const seatB = seats[middleSeat - i];
    if (isMine(seatA)) {
      mySeat = seatB;
      break;
    }
  }

  return mySeat;
}
