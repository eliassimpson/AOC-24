import { input } from "./5.input.ts";
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

  const rightlyOrdered: string[][] = [];

  for (const update of updates) {
    const pages: string[] = update.split(",");
    let isRightOrder = true;

    const printedPages: string[] = [pages[0]];

    pages.forEach((page) => {
      const applyRules = getRulesToApply(page, rulesMap, pages);

      for (const must of applyRules ?? []) {
        if (!printedPages.includes(must)) {
          isRightOrder = false;
          break;
        }
      }
      printedPages.push(page);
    });

    if (isRightOrder && pages) {
      rightlyOrdered.push(pages);
    }
  }

  return rightlyOrdered.reduce((previous, current) => {
    const middleIndex = current.length / 2 - 0.5;
    return (previous += Number(current[middleIndex]));
  }, 0);
};

export const getRulesToApply = (
  page: string,
  rulesMap: Record<string, string[]>,
  pages: string[]
) => {
  const rules = new Set(rulesMap[page]);
  const apply = new Set(pages);
  const appliedRulesSet = new Set([...rules].filter((rule) => apply.has(rule)));
  return Array.from(appliedRulesSet);
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
    expect(result).toEqual(143);
  })();

  console.log(solve(input));
}
