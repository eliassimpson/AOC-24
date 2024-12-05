import { expect } from "jsr:@std/expect/expect";
import { input } from "./8.input.ts";

type Coordinate = number[];
type Directions = "NE" | "SE" | "SW" | "NW";
const spanMath: Record<Directions, number[]> = {
  NE: [1, 1],
  SE: [1, -1],
  SW: [-1, -1],
  NW: [-1, 1],
};

const solve = (input: string) => {
  const lines = input.trim().split(/\n/);

  const map = lines.map((line) => line.trim().split(""));
  const valuesMap: Record<string, Coordinate[]> = {};

  const antennaLocations: Coordinate[] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      const mapValue = map[i][j];
      if (mapValue === ".") {
        continue;
      }
      if (!valuesMap[mapValue]) {
        valuesMap[mapValue] = [];
      }
      antennaLocations.push([i, j]);
      valuesMap[mapValue].push([i, j]);
    }
  }

  const antinodes = Object.keys(valuesMap).flatMap((value) =>
    discoverAntinodes(valuesMap[value], [map.length, map[0].length])
  );

  const inboundAntinodes = antinodes.filter((antinode) =>
    isInbound(antinode, [map.length, map[0].length])
  );

  const uniqueAntinodes = new Set(
    inboundAntinodes.concat(antennaLocations).map(([x, y]) => "" + x + "-" + y)
  );

  return [...uniqueAntinodes].length;
};

const isInbound = (antinode: Coordinate, max: Coordinate) => {
  const [x, y] = antinode;
  return x >= 0 && y >= 0 && x < max[0] && y < max[1];
};

const discoverAntinodes = (
  nodes: Coordinate[],
  max: Coordinate,
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

  const nodesRelativeDirection = getDirections(nodes[start], nodes[next]);

  const [startAntinode, nextAntinode] = makeAntinodes(
    nodesRelativeDirection,
    span,
    nodes[start],
    nodes[next]
  );

  antinodes.push(startAntinode);
  antinodes.push(nextAntinode);

  let startHarmonicAntinodes = startAntinode;
  while (isInbound(startHarmonicAntinodes, max)) {
    startHarmonicAntinodes = doSpan(
      startHarmonicAntinodes,
      span,
      nodesRelativeDirection[0]
    );
    antinodes.push(startHarmonicAntinodes);
  }

  let nextHarmonicAntinodes = nextAntinode;
  while (isInbound(nextHarmonicAntinodes, max)) {
    nextHarmonicAntinodes = doSpan(
      nextHarmonicAntinodes,
      span,
      nodesRelativeDirection[1]
    );
    antinodes.push(nextHarmonicAntinodes);
  }

  return discoverAntinodes(nodes, max, start, ++next, antinodes);
};

const makeAntinodes = (
  nodesRelativeDirection: Directions[],
  span: Coordinate,
  start: Coordinate,
  next: Coordinate
) => {
  const startAntinode: number[] = doSpan(
    start,
    span,
    nodesRelativeDirection[0]
  );
  const nextAntinode: number[] = doSpan(next, span, nodesRelativeDirection[1]);

  return [startAntinode, nextAntinode];
};

const getDirections = (start: Coordinate, next: Coordinate) => {
  const [startX, startY] = start;
  const [nextX, nextY] = next;

  const nodesRelativeDirection: Directions[] = [];

  if (startX > nextX) {
    if (startY > nextY) {
      nodesRelativeDirection.push("NE");
      nodesRelativeDirection.push("SW");
    } else {
      nodesRelativeDirection.push("SE");
      nodesRelativeDirection.push("NW");
    }
  } else {
    if (startY > nextY) {
      nodesRelativeDirection.push("NW");
      nodesRelativeDirection.push("SE");
    } else {
      nodesRelativeDirection.push("SW");
      nodesRelativeDirection.push("NE");
    }
  }

  return nodesRelativeDirection;
};

const doSpan = (
  node: Coordinate,
  span: number[],
  spanDirection: Directions
) => {
  const [spanXDirection, spanYDirection] = spanMath[spanDirection];
  const [spanX, spanY] = span;
  return [spanXDirection * spanX + node[0], spanYDirection * spanY + node[1]];
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
  expect(result).toEqual(34);

  (() => {
    console.log(solve(input));
  })();
}
