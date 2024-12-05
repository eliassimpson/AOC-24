import { expect } from "jsr:@std/expect/expect";
import { input } from "./8.input.ts";

type Coordinate = number[];

const solve = (input: string) => {
  const lines = input.trim().split(/\n/);

  const map = lines.map((line) => line.trim().split(""));
  const valuesMap: Record<string, Coordinate[]> = {};

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      const mapValue = map[i][j];
      if (mapValue === ".") {
        continue;
      }
      if (!valuesMap[mapValue]) {
        valuesMap[mapValue] = [];
      }
      valuesMap[mapValue].push([i, j]);
    }
  }

  const antinodes = Object.keys(valuesMap).flatMap((value) =>
    discoverAntinodes(valuesMap[value])
  );

  const inboundAntinodes = antinodes.filter(
    ([x, y]) => x >= 0 && y >= 0 && x < map.length && y < map[0].length
  );

  const uniqueAntinodes = new Set(
    inboundAntinodes.map(([x, y]) => "" + x + "-" + y)
  );

  return [...uniqueAntinodes].length;
};

const discoverAntinodes = (
  nodes: Coordinate[],
  start: number = 0,
  next: number = 1,
  antinodes: Coordinate[] = []
) => {
  if (next === nodes.length) {
    start++;
    next = start + 1;
    if (start === nodes.length - 1 || next === nodes.length) {
      return antinodes;
    }
  }
  const span = getSpan(nodes[start], nodes[next]);

  const startX = nodes[start][0];
  const startY = nodes[start][1];
  const nextX = nodes[next][0];
  const nextY = nodes[next][1];

  const startAntinode: number[] = [];
  const nextAntinode: number[] = [];

  if (startX > nextX) {
    startAntinode.push(startX + span[0]);
    nextAntinode.push(nextX - span[0]);
  } else {
    nextAntinode.push(nextX + span[0]);
    startAntinode.push(startX - span[0]);
  }

  if (startY > nextY) {
    startAntinode.push(startY + span[1]);
    nextAntinode.push(nextY - span[1]);
  } else {
    nextAntinode.push(nextY + span[1]);
    startAntinode.push(startY - span[1]);
  }

  antinodes.push(...[startAntinode, nextAntinode]);

  return discoverAntinodes(nodes, start, ++next, antinodes);
};

const getSpan = (start: Coordinate, end: Coordinate) => {
  return [Math.abs(start[0] - end[0]), Math.abs(start[1] - end[1])];
};

if (import.meta.main) {
  const result = solve(`............
        ........0...
        .....0......
        .......0....
        ....0.......
        ......A.....
        ............
        ............
        ........A...
        .........A..
        ............
        ............`);
  expect(result).toEqual(14);

  (() => {
    console.log(solve(input));
  })();
}
