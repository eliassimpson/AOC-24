import { expect } from "jsr:@std/expect/expect";
import { input } from "./6.input.ts";

type Step = "^" | ">" | "v" | "<" | "#" | ".";
type Steps = Step[];
type StepsMap = Steps[][];

const vectorMap: Record<string, number[]> = {
  ["^"]: [-1, 0],
  [">"]: [0, 1],
  ["v"]: [1, 0],
  ["<"]: [0, -1],
};

const vectorRedirect: Record<string, Step> = {
  ["^"]: ">",
  [">"]: "v",
  ["v"]: "<",
  ["<"]: "^",
};

const createMap = (
  map: string[],
  steps: StepsMap
): { guardCoordinates: number[]; guardSymbol: Step } => {
  let guardCoordinates: number[] = [];
  let guardSymbol = "" as Step;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      const theChar = map[i].charAt(j);
      steps[i].push([theChar as Step]);
      if (
        theChar === "v" ||
        theChar === "^" ||
        theChar === "<" ||
        theChar === ">"
      ) {
        guardCoordinates = [i, j];
        guardSymbol = theChar;
      }
    }
  }
  return { guardCoordinates, guardSymbol };
};

const solve = (input: string) => {
  const lines = input
    .trim()
    .split(/\s+/)
    .map((row) => row.trim());

  const steps: StepsMap = new Array(lines.length).fill(null).map(() => []);

  const { guardCoordinates, guardSymbol } = createMap(lines, steps);

  const stepsClone = structuredClone(steps);

  const vector = vectorMap[guardSymbol];
  const nextCoordinates = vectorStep(guardCoordinates, vector);

  //this returns a boolean if it ends. it will need to call itself with a dummy map
  const solutions = stepUntilEnd(
    steps,
    nextCoordinates,
    guardSymbol,
    stepsClone
  );

  const solutionStrings = solutions.map(([x, y]) => `${x}${y}`);
  const solutionsSet = new Set(solutionStrings);
  return [...solutionsSet].length;
};

const stepUntilEnd = (
  steps: StepsMap,
  nextCoordinates: number[],
  guardSymbol: Step,
  stepsClones: StepsMap,
  solutions: number[][] = [],
  isHypothetical: boolean = false,
  blockCoordinate?: number[]
): number[][] => {
  let vector: number[] = [];

  while (stepIsInBoundary(nextCoordinates, steps)) {
    const isBlocked = symbolAtCoordinate(steps, nextCoordinates)[0] === "#";

    if (!isHypothetical && !isBlocked) {
      const hypotheticalSymbol = vectorRedirect[guardSymbol] as Step;
      const hypotheticalVector = vectorMap[hypotheticalSymbol];
      const origin = vectorStepBack(vector, nextCoordinates);
      const hypotheticalNextCoordinates = vectorStep(
        hypotheticalVector,
        origin
      );
      const stepsMapClone = structuredClone(stepsClones);
      stepsMapClone[nextCoordinates[0]][nextCoordinates[1]] = ["#" as Step];
      stepUntilEnd(
        stepsMapClone,
        hypotheticalNextCoordinates,
        hypotheticalSymbol,
        stepsClones,
        solutions,
        true,
        nextCoordinates
      );
    }

    if (steps[nextCoordinates[0]][nextCoordinates[1]].includes(guardSymbol)) {
      //   console.table(steps);
      //   console.log(blockCoordinate);
      solutions.push(blockCoordinate!);
      break;
    }
    if (!stepIsInBoundary(nextCoordinates, steps)) {
      break;
    }

    if (isBlocked) {
      guardSymbol = vectorRedirect[guardSymbol] as Step;
      nextCoordinates = vectorStepBack(vector, nextCoordinates);
    } else {
      steps[nextCoordinates[0]][nextCoordinates[1]].push(guardSymbol);
      vector = vectorMap[guardSymbol];
      nextCoordinates = vectorStep(nextCoordinates, vector);
    }
  }
  return solutions;
};

const symbolAtCoordinate = (steps: StepsMap, coordinate: number[]) => {
  return steps[coordinate[0]][coordinate[1]];
};

const vectorStep = (vector: number[], coordinate: number[]) => {
  return [coordinate[0] + vector[0], coordinate[1] + vector[1]];
};

const vectorStepBack = (vector: number[], coordinate: number[]) => {
  return [coordinate[0] - vector[0], coordinate[1] - vector[1]];
};

const stepIsInBoundary = (coordinates: number[], steps: StepsMap) => {
  return (
    coordinates[0] < steps.length &&
    coordinates[1] < steps[0].length &&
    coordinates[0] >= 0 &&
    coordinates[1] >= 0
  );
};

if (import.meta.main) {
  (() => {
    const result = solve(`.....
        >...#
        .....
        #....
        ...#.`);

    expect(result).toEqual(1);
  })();

  (() => {
    const result = solve(`....#.....
            .........#
            ..........
            ..#.......
            .......#..
            ..........
            .#..^.....
            ........#.
            #.........
            ......#...`);
    expect(result).toEqual(6);
  })();

  (() => {
    console.log(solve(input));
  })();
}
