type Seat = "#" | "." | "L";
type Position = {
  seat: Seat;
  x: number;
  y: number;
};

type Layout = Seat[][];

type State = {
  layout: Layout;
  result: number;
};

type Rules = Record<Seat, (layout: Layout, x: number, y: number) => Seat>;

const parseInput = (input: string[]): Layout => {
  return input.map((x) => x.split("") as Seat[]);
};

const bySeatTaken = (x: Seat | null): boolean => x === "#";

const select = (layout: Layout, x: number, y: number): Position | null => {
  const row = layout[y];
  if (row == null) return null;
  const seat = row[x];
  return seat ? { seat, x, y } : null;
};

const selectors: Record<
  string,
  (layout: Layout, x: number, y: number) => Position | null
> = {
  top: (layout, x, y) => select(layout, x, y - 1),
  left: (layout, x, y) => select(layout, x - 1, y),
  right: (layout, x, y) => select(layout, x + 1, y),
  bottom: (layout, x, y) => select(layout, x, y + 1),
  topLeft: (layout, x, y) => select(layout, x - 1, y - 1),
  topRight: (layout, x, y) => select(layout, x + 1, y - 1),
  bottomLeft: (layout, x, y) => select(layout, x - 1, y + 1),
  bottomRight: (layout, x, y) => select(layout, x + 1, y + 1),
};

const getAdjacentSeats = (layout: Layout, x: number, y: number) => {
  return Object.values(selectors)
    .map((fn) => fn(layout, x, y)?.seat ?? null)
    .filter(bySeatTaken);
};

const getAdjacentSeatsRecursive = (layout: Layout, x: number, y: number) => {
  return Object.values(selectors)
    .map((fn) => {
      function getResult(layout: Layout, x1: number, y1: number): Seat | null {
        const result = fn(layout, x1, y1);
        if (result == null) return null;
        if (result?.seat !== ".") return result.seat;
        return getResult(layout, result.x, result.y);
      }

      return getResult(layout, x, y);
    })
    .filter(bySeatTaken);
};

const pass = (layout: Layout, rules: Rules): State => {
  let result = 0;
  const nextLayout: Layout = [];

  for (let y = 0; y < layout.length; y += 1) {
    const row: Seat[] = [];

    for (let x = 0; x < layout[0].length; x += 1) {
      const seat = layout[y][x] as Seat;
      const nextSeat = rules[seat](layout, x, y);

      row.push(nextSeat);
      if (seat !== nextSeat) {
        result += 1;
      }
    }

    nextLayout.push(row);
  }

  return { result, layout: nextLayout };
};

function calcSeats(rules: Rules, state: State): State {
  const nextState = pass(state.layout, rules);
  if (state.result === 0 && nextState.result === 0) return state;
  return calcSeats(rules, nextState);
}

export function one(input: string[]) {
  const rules = {
    ".": (): Seat => ".",
    L: (layout: Layout, x: number, y: number): Seat => {
      const adjacentSeats = getAdjacentSeats(layout, x, y);
      return adjacentSeats.length === 0 ? "#" : "L";
    },
    "#": (layout: Layout, x: number, y: number): Seat => {
      const adjacentSeats = getAdjacentSeats(layout, x, y);
      return adjacentSeats.length >= 4 ? "L" : "#";
    },
  };

  return calcSeats(rules, {
    layout: parseInput(input),
    result: -1,
  })
    .layout.flat()
    .filter(bySeatTaken).length;
}

export function two(input: string[]) {
  const rules = {
    ".": (): Seat => ".",
    L: (layout: Layout, x: number, y: number): Seat => {
      const adjacentSeats = getAdjacentSeatsRecursive(layout, x, y);
      return adjacentSeats.length === 0 ? "#" : "L";
    },
    "#": (layout: Layout, x: number, y: number): Seat => {
      const adjacentSeats = getAdjacentSeatsRecursive(layout, x, y);
      return adjacentSeats.length >= 5 ? "L" : "#";
    },
  };

  return calcSeats(rules, {
    layout: parseInput(input),
    result: -1,
  })
    .layout.flat()
    .filter(bySeatTaken).length;
}
