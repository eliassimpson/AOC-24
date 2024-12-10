import { expect } from "jsr:@std/expect/expect";
import { input } from "./7.input.ts";

const solve = (input: string) => {
  const lines = input
    .trim()
    .split(/\n/)
    .map((row) => row.trim());

  const equations = lines.map((line) => {
    const [solution, rawInput] = line.split(":");
    return {
      solution,
      inputs: rawInput.trim().split(/\s+/).map(Number),
    };
  });

  let sum = 0;
  equations.forEach(({ solution: s, inputs }) => {
    const solution = Number(s);
    const result = operate(inputs, solution);
    if (result) {
      sum += solution;
    }
  });

  return sum;
};

const operate = (inputs: number[], target: number): number => {
  const earlyExit = inputs[0] > target;
  if (earlyExit) {
    return 0;
  }
  if (inputs.length === 1) {
    if (inputs[0] === target) {
      return inputs[0];
    }
    return 0;
  }
  const sum = inputs[0] + inputs[1];
  const product = inputs[0] * inputs[1];
  const remaining = inputs.slice(2);

  return (
    operate([sum].concat(remaining), target) +
    operate([product].concat(remaining), target)
  );
};

if (import.meta.main) {
  //   (() => {
  //     const result = solve(`
  //         190: 10 19
  //         3267: 81 40 27
  //         `);
  //     expect(result).toEqual(3749);
  //   })();

  const result = solve(`190: 10 19
  3267: 81 40 27
  83: 17 5
  156: 15 6
  7290: 6 8 6 15
  161011: 16 10 13
  192: 17 8 14
  21037: 9 7 18 13
  292: 11 6 16 20`);
  expect(result).toEqual(3749);

  (() => {
    console.log(solve(input));
  })();
}
