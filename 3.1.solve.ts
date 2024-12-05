import { input } from "./3.input.ts";

const getProduct = (rawFactors: string) => {
  const parenthesisRegex: RegExp = /\(([^\)]+)\)/i;
  const insideParenthesis = rawFactors.match(parenthesisRegex)[1];
  const numbers = insideParenthesis.split(",").map(Number);
  return numbers[0] * numbers[1];
};

const multiplyRegex: RegExp = /mul\(\d+\s*,\s*\d+\)/g;
const match = input.match(multiplyRegex);

let sum = 0;
for (const mul of match) {
  sum += getProduct(mul);
}

console.log(sum);
