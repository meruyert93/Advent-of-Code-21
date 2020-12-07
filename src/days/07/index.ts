type Bag = {
  type: string;
  children: BagContraint[];
};

type BagContraint = {
  type: string;
  amount: number;
};

function parseChildren(str: string): BagContraint[] {
  if (str === "no other bags.") return [];
  const children = [];

  const re = /(\d\d?)\s(.*?)\sbags?(?:,|\.)/g;
  let res;

  while ((res = re.exec(str)) != null) {
    children.push({
      type: res[2],
      amount: Number.parseInt(res[1], 10),
    });
  }

  return children;
}

function parseRule(line: string): Bag {
  const [type, childStr] = line.split("bags contain");
  return {
    type: type.trim(),
    children: parseChildren(childStr),
  };
}

function parseRules(input: string[]): Map<string, Bag> {
  const nodes = new Map();
  input.forEach((line) => {
    const node = parseRule(line);
    nodes.set(node.type, node);
  });
  return nodes;
}

function getCanContainShinyGold(
  type: string,
  nodes: Map<string, Bag>
): boolean {
  const { children } = nodes.get(type) as Bag;
  if (children.length === 0) return false;
  if (children.find((x) => x.type === "shiny gold")) return true;
  return children.some((c: BagContraint) =>
    getCanContainShinyGold(c.type, nodes)
  );
}

export function one(input: string[]): number {
  const nodes = parseRules(input);
  const types = Array.from(nodes.keys());
  return types.reduce(
    (acc, curr) => (getCanContainShinyGold(curr, nodes) ? acc + 1 : acc),
    0
  );
}

function getSumOfBags(
  count: number,
  multiplier: number,
  type: string,
  nodes: Map<string, Bag>
): number {
  const { children } = nodes.get(type) as Bag;
  if (children.length === 0) return count;
  return children.reduce((acc, curr) => {
    const bagAmount = curr.amount * multiplier;
    const currentMultiplier = curr.amount * multiplier;
    return (
      acc + bagAmount + getSumOfBags(count, currentMultiplier, curr.type, nodes)
    );
  }, count);
}

export function two(input: string[]): number {
  const nodes = parseRules(input);
  return getSumOfBags(0, 1, "shiny gold", nodes);
}
