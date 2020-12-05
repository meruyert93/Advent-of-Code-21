type Passport = Record<string, string>;
type Validator = (val: string) => boolean;

// in an ideal world, we could do this directly when reading the file.
// my little input framework currently does not support that.
function readPassports(input: string[]): Passport[] {
  type PassportAccumulator = {
    passports: Passport[],
    currentPassport: Passport
  };

  const { passports } = input.reduce((acc: PassportAccumulator, line: string, idx: number): PassportAccumulator => {
    const isEmpty = line === '';
    const isLast = idx === input.length - 1;

    if (isEmpty) {
      return {
        currentPassport: {},
        passports: [...acc.passports, acc.currentPassport],
      };
    }

    const entries = Object.fromEntries(line.split(' ').map(s => s.split(':')));
    const currentPassport = { ...acc.currentPassport, ...entries };

    if (isLast) {
      return {
        currentPassport: {},
        passports: [...acc.passports, currentPassport],
      };
    }

    return { ...acc, currentPassport };
  }, { currentPassport: {}, passports: [] });

  return passports;
}

const rules = {
  requiredPresent(passport: Passport): boolean {
    const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
    return requiredFields.every(x => Object.hasOwnProperty.call(passport, x));
  },
  between(min: number, max: number): Validator {
    return (val) => {
      const num = Number.parseInt(val, 10);
      return Number.isInteger(num) && num >= min && num <= max;  
    };
  },
  height(): Validator {
    return (val) => {
      const ending = val.substr(val.length - 2);
      const rest = val.substr(0, val.length - 2);

      if (ending === 'cm') {
        return rules.between(150, 193)(rest);
      } else if (ending === 'in') {
        return rules.between(59, 76)(rest);
      }

      return false;
    };
  },
  hex(): Validator {
    return (val) => {
      const firstChar = val[0];
      if (firstChar !== '#') return false;
      const rest = val.substr(1);
      return rest.length === 6 &&
        rest.split('').every((char) => /\d|[a-f]/.test(char));
    };
  },
  eyeColor(): Validator {
    return (val) => {
      return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val);
    }
  },
  digits(len: number): Validator {
    return (val) => {
      const letters = val.split('');
      return letters.length === len && letters.every(x => Number.isInteger(Number.parseInt(x, 10)));  
    };
  },
  pass(): Validator {
    return () => true;
  }
};

export function one(input: string[]): number {
  return readPassports(input).reduce((acc: number, curr: Passport) => {
    return rules.requiredPresent(curr) ? acc + 1 : acc;
  }, 0);
}

export function two(input: string[]): number {
  const validators: Record<string, Validator> = {
    byr: rules.between(1920, 2002),
    iyr: rules.between(2010, 2020),
    eyr: rules.between(2020, 2030),
    hgt: rules.height(),
    hcl: rules.hex(),
    ecl: rules.eyeColor(),
    pid: rules.digits(9),
    cid: rules.pass(),
  };

  function validate(passport: Passport): boolean {
    if (!rules.requiredPresent(passport)) return false;
    return Object.entries(passport)
      .every(([key, value]) => validators[key](value));
  }

  return readPassports(input)
    .reduce((acc: number, curr: Passport): number => {
      return validate(curr) ? acc + 1 : acc;
    }, 0);
}
