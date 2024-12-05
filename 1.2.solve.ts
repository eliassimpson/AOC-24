import { input } from "./1.input.ts";

const lines: string[] = input.trim().split("\n");

const leftValues: string[] = [];
const rightValues: string[] = [];

for (const line of lines) {
  const [left, right] = line.trim().split(/\s+/);
  leftValues.push(left);
  rightValues.push(right);
}

leftValues.sort();
rightValues.sort();

const rightValuesMap: Record<string, number> = rightValues.reduce(
  (previous, current) => {
    previous[current.toString()] = (previous[current] || 0) + 1;
    return previous;
  },
  {}
);

const leftValuesMap: Record<string, number> = leftValues.reduce(
  (previous, current) => {
    previous[current.toString()] = (previous[current] || 0) + 1;
    return previous;
  },
  {}
);

const leftValueSet = Object.keys(leftValuesMap);

let sum = 0;
for (const leftValue of leftValueSet) {
  sum +=
    Number(leftValue) * rightValuesMap[leftValue] ||
    0 * leftValuesMap[leftValue];
}

console.log(sum);
