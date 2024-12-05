import { input } from "./2.input.ts";

const reports: String[] = input.trim().split("\n");

const reportsLevels: number[][] = [];
for (const report of reports) {
  reportsLevels.push(report.split(" ").map(Number));
}

let sum = 0;

const checkSafety = (
  levels: number[]
): { isSafe: boolean; indicesFailed: number[] } => {
  let isSafe: boolean = true;
  let increaseNotDecrease = levels[0] < levels[1] ? true : false;
  let indicesFailed: number[] = [];

  for (let i = 0; i < levels.length - 1; i++) {
    if (increaseNotDecrease && levels[i] > levels[i + 1]) {
      isSafe = false;
    }
    if (!increaseNotDecrease && levels[i] < levels[i + 1]) {
      isSafe = false;
    }
    const difference = Math.abs(levels[i] - levels[i + 1]);
    if (difference === 0 || difference > 3) {
      isSafe = false;
    }
    if (!isSafe) {
      indicesFailed = [i, i + 1];
      break;
    }
  }

  return { isSafe, indicesFailed };
};

for (const reportLevel of reportsLevels) {
  let { isSafe, indicesFailed } = checkSafety(reportLevel);

  if (!isSafe) {
    ({ isSafe } = checkSafety(reportLevel.toSpliced(indicesFailed[0], 1)));
  }
  if (!isSafe) {
    ({ isSafe } = checkSafety(reportLevel.toSpliced(indicesFailed[1], 1)));
  }
  if (!isSafe) {
    ({ isSafe } = checkSafety(reportLevel.toSpliced(0, 1)));
  }

  if (isSafe) {
    sum++;
  }
}

console.log(sum);
