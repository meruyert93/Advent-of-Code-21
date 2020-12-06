type Member = string[];
type Group = Member[];

function collectAnswers(input: string[]): Group[] {
  type GroupAcc = { groups: Group[]; current: Group };

  const { groups } = input.reduce(
    (acc: GroupAcc, line: string, i: number): GroupAcc => {
      if (line === "") {
        return { groups: [...acc.groups, acc.current], current: [] };
      }

      const member = line.split("");
      const nextGroup = [...acc.current, member];

      if (i === input.length - 1) {
        return { groups: [...acc.groups, nextGroup], current: [] };
      }

      return { groups: acc.groups, current: nextGroup };
    },
    { groups: [], current: [] }
  );

  return groups;
}

export function one(input: string[]): number {
  return collectAnswers(input).reduce((acc, group) => {
    const set = new Set();

    group.forEach((member) => {
      member.forEach((answer) => {
        set.add(answer);
      });
    });

    return acc + set.size;
  }, 0);
}

export function two(input: string[]): number {
  return collectAnswers(input).reduce((acc, group) => {
    const set = new Set();
    group.forEach((member) => {
      member.forEach((answer) => {
        if (group.every((member) => member.includes(answer))) {
          set.add(answer);
        }
      });
    });

    return acc + set.size;
  }, 0);
}
