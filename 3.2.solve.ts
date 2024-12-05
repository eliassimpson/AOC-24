import { input } from "./3.input.ts";

const multiplyRegex: RegExp = /mul\(\d+\s*,\s*\d+\)|do\(\)|don't\(\)/g;
const match = input.match(multiplyRegex);

const getProduct = (rawFactors: string) => {
  const parenthesisRegex: RegExp = /\(([^\)]+)\)/i;
  const insideParenthesis = rawFactors.match(parenthesisRegex)[1];
  const numbers = insideParenthesis.split(",").map(Number);
  return numbers[0] * numbers[1];
};

let sum = 0;
let yesDo = true;
for (const expression of match) {
  const expressionCode = expression.charAt(0);
  if (yesDo && expressionCode === "m") {
    sum += getProduct(expression);
  } else if (expression === "do()") {
    yesDo = true;
  } else {
    yesDo = false;
  }
}

console.log(sum);
