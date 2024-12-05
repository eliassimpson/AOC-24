import { input } from "./5.input.ts";
import { getRulesToApply } from "./5.1.solve.ts";

import { expect } from "jsr:@std/expect";
const solve = (input: string) => {
  const [rulesRaw, updatesRaw] = input
    .trim()
    .split(/\n\s*\n/)
    .map((update) => update.trim());

  const rules = rulesRaw.split(/\s+/).map((rule) => rule.trim());
  const updates = updatesRaw.split(/\s+/).map((update) => update.trim());

  const rulesMap = rules.reduce((previous, rule) => {
    const [must, page] = rule.split("|");
    if (previous[page]) {
      previous[page].push(must);
    } else {
      previous[page] = [must];
    }
    return previous;
  }, {} as Record<string, string[]>);

  const rectified: string[][] = [];
  for (const update of updates) {
    const pages: string[] = update.split(",");
    let needsRectified = false;
    const printedPages: string[] = [pages[0]];

    pages.forEach((page) => {
      const applyRules = getRulesToApply(page, rulesMap, pages);

      for (const must of applyRules ?? []) {
        if (!printedPages.includes(must)) {
          needsRectified = true;
          break;
        }
      }
      printedPages.push(page);
    });

    if (needsRectified) {
      rectified.push(rectifyUnright(pages, rulesMap));
    }
  }

  return rectified.reduce((previous, current) => {
    const middleIndex = current.length / 2 - 0.5;
    return (previous += Number(current[middleIndex]));
  }, 0);
};

const rectifyUnright = (
  pages: string[],
  rulesMap: Record<string, string[]>
): string[] => {
  const pagesRules: Record<string, string[]> = pages.reduce(
    (previous, page) => ({
      ...previous,
      [page]: getRulesToApply(page, rulesMap, pages),
    }),
    {}
  );

  let nextLap: string[] = pages.map((page) => page);
  const rectified: string[] = [];

  while (nextLap.length > 0) {
    nextLap = rectifyLoop(nextLap, pagesRules, rectified);
  }

  return rectified;
};

const rectifyLoop = (
  pages: string[],
  pagesRules: Record<string, string[]>,
  rectified: string[]
) => {
  const nextLap: string[] = [];

  for (const page of pages) {
    const rules = pagesRules[page];
    if (rules.every((rule) => rectified.includes(rule))) {
      rectified.push(page);
    } else {
      nextLap.push(page);
    }
  }
  return nextLap;
};

if (import.meta.main) {
  (() => {
    const result = solve(`47|53
    97|13
    97|61
    97|47
    75|29
    61|13
    75|53
    29|13
    97|29
    53|29
    61|53
    97|53
    61|29
    47|13
    75|47
    97|75
    47|61
    75|61
    47|29
    75|13
    53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`);
    expect(result).toEqual(123);
  })();

  console.log(solve(input));
}
