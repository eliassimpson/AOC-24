import { input } from "./4.input.ts";
import { expect } from "jsr:@std/expect";

const solve = (input: string) => {
  const lines: string[] = input
    .trim()
    .split(/\s+/)
    .map((line) => line.trim());

  const builtLines: string[] = [];

  builtLines.push(...lines);

  const verticalStrings: string[] = [];
  for (let i = 0; i < lines[0].length; i++) {
    verticalStrings.push(lines[0].charAt(i));
  }
  for (let i = 1; i < lines.length; i++) {
    for (let j = 0; j < lines[0].length; j++) {
      verticalStrings[j] += lines[i].charAt(j);
    }
  }

  builtLines.push(...verticalStrings);

  let diagnalStrings: string[] = [];
  for (let i = 0; i < lines[0].length; i++) {
    diagnalStrings.push(lines[0].charAt(i));
  }
  diagnalStrings.forEach((_, i) => {
    let j = 1;
    let k = i + 1;
    while (j < lines.length && k < lines[0].length) {
      diagnalStrings[i] += lines[j].charAt(k);
      j++;
      k++;
    }
  });

  for (let i = 1; i < lines.length; i++) {
    diagnalStrings.push(lines[i].charAt(0));
  }
  for (let i = lines[0].length; i < diagnalStrings.length; i++) {
    let j = i - lines[0].length + 2;
    let k = 1;
    while (j < lines.length && k < lines[0].length) {
      diagnalStrings[i] += lines[j].charAt(k);
      j++;
      k++;
    }
  }

  builtLines.push(...diagnalStrings);

  diagnalStrings = [];
  for (let i = 0; i < lines[0].length; i++) {
    diagnalStrings.push(lines[0].charAt(i));
  }
  diagnalStrings.forEach((_, i) => {
    let j = 1;
    let k = lines[0].length - 1 - i;
    while (j < lines.length && k > 0) {
      diagnalStrings[lines[0].length - 1 - i] += lines[j].charAt(k - 1);
      j++;
      k--;
    }
  });

  for (let i = 1; i < lines.length; i++) {
    diagnalStrings.push(lines[i].charAt(lines[0].length - 1));
  }
  for (let i = lines[0].length; i < diagnalStrings.length; i++) {
    let j = i - lines[0].length + 2;
    let k = lines[0].length - 2;
    while (j < lines.length && k >= 0) {
      diagnalStrings[i] += lines[j].charAt(k);
      j++;
      k--;
    }
  }

  builtLines.push(...diagnalStrings);

  const xmasRegex: RegExp = /XMAS/g;
  const samxRegex: RegExp = /SAMX/g;

  let sum = 0;

  for (const line of builtLines) {
    const xmasMatches = line.match(xmasRegex);
    sum += xmasMatches ? xmasMatches.length : 0;
    const samxMatches = line.match(samxRegex);
    sum += samxMatches ? samxMatches.length : 0;
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
  expect(result).toEqual(18);
})();

(() => {
  console.log(solve(input));
})();
