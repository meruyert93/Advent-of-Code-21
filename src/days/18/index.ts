type OpToken = "+" | "*";

interface LeftParens {
  type: "leftParens";
  level: number;
}

interface RightParens {
  type: "rightParens";
  level: number;
}

interface Num {
  type: "num";
  value: number;
}

interface Op {
  type: "op";
  value: OpToken;
}

type Token = LeftParens | RightParens | Op | Num;

interface TokenCollection extends Array<Token | TokenCollection> {}

const isLeftParens = (t: Token | TokenCollection): t is LeftParens =>
  !Array.isArray(t) && t["type"] === "leftParens";

const isRightParens = (t: Token | TokenCollection): t is RightParens =>
  !Array.isArray(t) && t["type"] === "rightParens";

const isNum = (t: Token | TokenCollection): t is Num =>
  !Array.isArray(t) && t["type"] === "num";

const isOp = (t: Token | TokenCollection | null): t is Op =>
  t != null && !Array.isArray(t) && t["type"] === "op";

const isTokenCollection = (t: Token | TokenCollection): t is TokenCollection =>
  Array.isArray(t);

const sum = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;

function tokenizer(input: string): Token[] {
  const output: Token[] = [];
  let level: number = 0;

  let numberStack: string[] = [];
  function pushNumberStack() {
    const num: Num = {
      type: "num",
      value: Number.parseInt(numberStack.join(""), 10),
    };

    output.push(num);
    numberStack = [];
  }

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    const isLast = i === input.length - 1;
    const isNumber = Number.isInteger(Number.parseInt(char, 10));

    if (isNumber) {
      numberStack.push(char);
      if (isLast) pushNumberStack();
    } else {
      if (numberStack.length > 0) pushNumberStack();
      if (char === "(") {
        const t: LeftParens = { type: "leftParens", level };
        level += 1;
        output.push(t);
      } else if (char === ")") {
        level -= 1;
        const t: RightParens = { type: "rightParens", level };
        output.push(t);
      } else if (char !== " ") {
        const t: Op = { type: "op", value: char as OpToken };
        output.push(t);
      }
    }
  }

  return output;
}

function parseParens(tokens: TokenCollection): TokenCollection {
  const leftParens = tokens
    .filter(isLeftParens)
    .sort((a, b) => b.level - a.level);
  if (leftParens.length === 0) return tokens;

  const highest = leftParens[0].level;
  const levelTokens = leftParens.filter((t) => t.level === highest);

  levelTokens.forEach((l) => {
    const lIndex = tokens.indexOf(l);

    const r = tokens.slice(lIndex).find(isRightParens);
    if (!r) throw new TypeError("unexpected end of input");
    const rIndex = tokens.indexOf(r);

    const len = rIndex - lIndex;
    tokens.splice(lIndex, len + 1, tokens.slice(lIndex + 1, rIndex));
  });

  if (highest === 0) return tokens;
  return parseParens(tokens);
}

const lexer = (input: string): TokenCollection => parseParens(tokenizer(input));

function basic(tokens: TokenCollection): number {
  const state: {
    op: Op | null;
    sum: number;
  } = { op: null, sum: 0 };

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (isOp(state.op) || i === 0) {
      const { op } = state;
      const mathOp = op == null || op.value === "+" ? sum : multiply;

      if (isNum(token)) {
        state.sum = mathOp(state.sum, token.value);
      } else if (isTokenCollection(token)) {
        state.sum = mathOp(state.sum, basic(token));
      }

      state.op = null;
    } else if (isOp(token)) {
      state.op = token;
    }
  }

  return state.sum;
}

function advanced(tokens: TokenCollection): number {
  const additions = tokens.filter((t) => isOp(t) && t.value === "+");

  const nested = tokens.filter(isTokenCollection);

  nested.forEach((t) => {
    const result = advanced(t);
    tokens.splice(tokens.indexOf(t), 1, { type: "num", value: result });
  });

  additions.forEach((t) => {
    const tIndex = tokens.indexOf(t);
    const l = tokens[tIndex - 1];
    const r = tokens[tIndex + 1];
    if (!isNum(r) || !isNum(l)) throw new TypeError("bad input");
    tokens.splice(tIndex - 1, 3, { type: "num", value: l.value + r.value });
  });

  return basic(tokens);
}

function solve(
  input: string[],
  solver: (tokens: TokenCollection) => number
): number {
  return input
    .map((l) => solver(lexer(l)))
    .reduce((acc: number, curr: number): number => sum(acc, curr), 0);
}

export function one(input: string[]) {
  return solve(input, basic);
}

export function two(input: string[]) {
  return solve(input, advanced);
}
