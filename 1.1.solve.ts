import { input } from "./1.input.ts";

const lines: String[] = input.trim().split("\n");

const leftValues: number[] = [];
const rightValues: number[] = [];

for (const line of lines) {
  const [left, right] = line.trim().split(/\s+/).map(Number);
  leftValues.push(left);
  rightValues.push(right);
}

leftValues.sort();
rightValues.sort();

let sum = 0;

for (let i = 0; i < leftValues.length; i++) {
  sum += Math.abs(leftValues[i] - rightValues[i]);
}

console.log(sum);
