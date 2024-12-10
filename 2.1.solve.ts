import { input } from "./2.input.ts";

const reports: string[] = input.trim().split("\n");

const reportsLevels: number[][] = [];
for (const report of reports) {
  reportsLevels.push(report.split(" ").map(Number));
}

let sum = 0;

for (const reportLevel of reportsLevels) {
  let isSafe: boolean = true;
  const increaseNotDecrease = reportLevel[0] < reportLevel[1] ? true : false;

  for (let i = 0; i < reportLevel.length - 1; i++) {
    if (increaseNotDecrease && reportLevel[i] > reportLevel[i + 1]) {
      isSafe = false;
      break;
    }
    if (!increaseNotDecrease && reportLevel[i] < reportLevel[i + 1]) {
      isSafe = false;
      break;
    }
    const difference = Math.abs(reportLevel[i] - reportLevel[i + 1]);
    if (difference === 0 || difference > 3) {
      isSafe = false;
      break;
    }
  }

  if (isSafe) {
    sum++;
  }
}

console.log(sum);
