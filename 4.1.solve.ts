import { input } from "./4.input.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const solve = (input: string) => {
  return 0;
};

(() => {
  assertEquals(
    solve(
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
    ),
    18
  );
})();

console.log(solve(input));
