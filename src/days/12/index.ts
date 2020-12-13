import { toInt } from "../../lib/helpers";

type Direction = "N" | "E" | "S" | "W";
type Turn = "L" | "R";
type Angle = 0 | 90 | 180 | 270;

type Action = {
  type: Direction | Turn | "F";
  argument: number;
};

type State = {
  x: number;
  y: number;
  angle: Angle;
};

type WaypointState = {
  x: number;
  y: number;
  waypoint: { x: number; y: number };
};

const ANGLES: Record<number, Direction> = {
  0: "N",
  90: "E",
  180: "S",
  270: "W",
};

function getX(x: number, action: Action): number {
  const factor = action.type === "E" ? 1 : -1;
  return x + action.argument * factor;
}

function getY(y: number, action: Action): number {
  const factor = action.type === "S" ? 1 : -1;
  return y + action.argument * factor;
}

function isValidAngle(x: number): x is Angle {
  return [0, 90, 180, 270].includes(x);
}

function getAngle(start: number, argument: number): Angle {
  const offset = (start + argument) % 360;
  const result = offset < 0 ? offset + 360 : offset;

  if (!isValidAngle(result)) {
    throw new TypeError(`invalid angle ${result}`);
  }
  return result;
}

function rotate(point: number[], angle: Angle, turn: Turn): number[] {
  const [x, y] = point;

  if (angle === 180) {
    return [-x, -y];
  } else if (
    (angle === 90 && turn === "R") ||
    (angle === 270 && turn === "L")
  ) {
    return [-y, x];
  }

  return [y, -x];
}

function parseAction(line: string): Action {
  const type = line[0] as Direction | Turn | "F";
  const argument = toInt(line.substring(1));
  return { type, argument };
}

function applyAction(state: State, action: Action): State {
  switch (action.type) {
    case "N":
    case "S": {
      return { ...state, y: getY(state.y, action) };
    }
    case "W":
    case "E": {
      return { ...state, x: getX(state.x, action) };
    }

    case "F": {
      return applyAction(state, {
        type: ANGLES[state.angle],
        argument: action.argument,
      });
    }

    case "L":
    case "R": {
      const nextAngle =
        action.type === "R"
          ? getAngle(state.angle, action.argument)
          : getAngle(state.angle, -action.argument);

      return { ...state, angle: nextAngle };
    }
  }
}

function applyWaypointAction(
  state: WaypointState,
  action: Action
): WaypointState {
  switch (action.type) {
    case "N":
    case "S": {
      const { y } = state.waypoint;
      return {
        ...state,
        waypoint: {
          ...state.waypoint,
          y: getY(y, action),
        },
      };
    }
    case "E":
    case "W": {
      const { x } = state.waypoint;
      return {
        ...state,
        waypoint: { ...state.waypoint, x: getX(x, action) },
      };
    }
    case "R":
    case "L": {
      const { argument: angle, type: turn } = action;
      const { x, y } = state.waypoint;
      const [x1, y1] = rotate([x, y], angle as Angle, turn);
      return {
        ...state,
        waypoint: { x: x1, y: y1 },
      };
    }
    case "F": {
      const x1 = state.x + state.waypoint.x * action.argument;
      const y1 = state.y + state.waypoint.y * action.argument;
      return {
        ...state,
        x: x1,
        y: y1,
      };
    }
  }
}

export function one(input: string[]) {
  const initialState: State = {
    x: 0,
    y: 0,
    angle: 90,
  };

  const lastState = input.map(parseAction).reduce(applyAction, initialState);

  return Math.abs(lastState.x) + Math.abs(lastState.y);
}

export function two(input: string[]): number {
  const initialState: WaypointState = {
    x: 0,
    y: 0,
    waypoint: { x: 10, y: -1 },
  };

  const lastState = input
    .map(parseAction)
    .reduce(applyWaypointAction, initialState);

  return Math.abs(lastState.x) + Math.abs(lastState.y);
}
