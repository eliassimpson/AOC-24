import { expect } from "jsr:@std/expect/expect";
import { input } from "./6.input.ts";

type Steps = string[][];

const vectorMap: Record<string, number[]> = {
  ["^"]: [-1, 0],
  [">"]: [0, 1],
  ["v"]: [1, 0],
  ["<"]: [0, -1],
};

const vectorRedirect: Record<string, string> = {
  ["^"]: ">",
  [">"]: "v",
  ["v"]: "<",
  ["<"]: "^",
};

const getGuardCoordinates = (map: string[]) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      const theChar = map[i].charAt(j);
      if (
        theChar === "v" ||
        theChar === "^" ||
        theChar === "<" ||
        theChar === ">"
      ) {
        return { coordinates: [i, j], symbol: map[i].charAt(j) };
      }
    }
  }
  return { coordinates: [], symbol: "" };
};

const solve = (input: string) => {
  const lines = input
    .trim()
    .split(/\s+/)
    .map((row) => row.trim());

  let { coordinates, symbol } = getGuardCoordinates(lines);

  const steps: Steps = new Array(lines.length)
    .fill(null)
    .map(() => new Array(lines[0].length).fill("o"));

  let vector = vectorMap[symbol];
  let nextCoordinates = [
    coordinates[0] + vector[0],
    coordinates[1] + vector[1],
  ];

  while (stepIsInBoundary(nextCoordinates, lines)) {
    steps[nextCoordinates[0]][nextCoordinates[1]] = "x";
    vector = vectorMap[symbol];
    nextCoordinates = [
      nextCoordinates[0] + vector[0],
      nextCoordinates[1] + vector[1],
    ];
    if (!stepIsInBoundary(nextCoordinates, lines)) {
      break;
    }
    let redirect = lines[nextCoordinates[0]].charAt(nextCoordinates[1]) === "#";
    while (redirect) {
      nextCoordinates = [
        nextCoordinates[0] - vector[0],
        nextCoordinates[1] - vector[1],
      ];
      symbol = vectorRedirect[symbol] as string;
      vector = vectorMap[symbol];
      nextCoordinates = [
        nextCoordinates[0] + vector[0],
        nextCoordinates[1] + vector[1],
      ];
      redirect = lines[nextCoordinates[0]].charAt(nextCoordinates[1]) === "#";
    }
  }

  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[0].length; j++) {
      if (steps[i][j] === "x") {
        sum++;
      }
    }
  }
  console.table(lines);
  return sum;
};

const stepIsInBoundary = (coordinates: number[], lines: string[]) => {
  return (
    coordinates[0] < lines.length &&
    coordinates[1] < lines[0].length &&
    coordinates[0] >= 0 &&
    coordinates[1] >= 0
  );
};

if (import.meta.main) {
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
    expect(result).toEqual(41);
  })();

  (() => {
    console.log(solve(input));
  })();
}
