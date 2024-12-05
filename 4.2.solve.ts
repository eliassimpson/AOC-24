import { input } from "./4.input.ts";
import { expect } from "jsr:@std/expect";

const solve = (input: string) => {
  const lines: string[] = input
    .trim()
    .split(/\s+/)
    .map((line) => line.trim());

  const linesAndLetters: string[][] = lines.map((line) => {
    const letters: string[] = [];
    for (let i = 0; i < line.length; i++) {
      letters.push(line.charAt(i));
    }
    return letters;
  });

  let sum = 0;
  for (let i = 1; i < linesAndLetters.length - 1; i++) {
    for (let j = 1; j < linesAndLetters[0].length - 1; j++) {
      let xShapeWord = "";
      xShapeWord += linesAndLetters[i - 1][j - 1];
      xShapeWord += linesAndLetters[i - 1][j + 1];
      xShapeWord += linesAndLetters[i][j];
      xShapeWord += linesAndLetters[i + 1][j - 1];
      xShapeWord += linesAndLetters[i + 1][j + 1];
      if (xShapeWord === "MSAMS") {
        sum++;
      }
      if (xShapeWord === "SMASM") {
        sum++;
      }
      if (xShapeWord === "SSAMM") {
        sum++;
      }
      if (xShapeWord === "MMASS") {
        sum++;
      }
    }
  }
  return sum;
};

(() => {
  const result = solve(
    `MMMSXXMASM
      MSAMXMSMSA
      AMXSXMAAMM
      MSAMASMSMX
      XMASAMXAMM
      XXAMMXXAMA
      SMSMSASXSS
      SAXAMASAAA
      MAMMMXMMMM
      MXMXAXMASX`
  );
  expect(result).toEqual(9);
})();

(() => {
  console.log(solve(input));
})();
