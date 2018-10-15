import { diffChars, diffWords } from "diff";
import { diff as deepDiff } from "deep-diff";
import chalk from "chalk";

export function diff(firstItem: any, secondItem: any) {
  if (typeof firstItem === "string") {
    return diffString(firstItem, secondItem);
  }

  return buildDiff(deepDiff(firstItem, secondItem) || [], "");
}

function diffString(firstString: string, secondString: string) {
  const diffs =
    /\s/.test(firstString) || /\s/.test(secondString)
      ? diffWords(firstString, secondString)
      : diffChars(firstString, secondString);
  return diffs
    .map(
      diffItem =>
        diffItem.added
          ? chalk.green(diffItem.value)
          : diffItem.removed
            ? chalk.red(diffItem.value)
            : diffItem.value
    )
    .join("");
}

function buildDiff(
  diffs: Array<deepDiff.IDiff>,
  parentProperty: string
): string {
  if (diffs.length === 0) {
    return "no differences";
  } else if (diffs.length === 1 && diffs[0].path === undefined) {
    const onlyDiff = diffs[0];

    if (onlyDiff.kind === "E") {
      return diffString(
        JSON.stringify(onlyDiff.lhs),
        JSON.stringify(onlyDiff.rhs)
      );
    }

    return chalk.green(onlyDiff.lhs || onlyDiff.rhs);
  }
  // probably an array
  else if (diffs.every(diffItem => diffItem.path === undefined)) {
    return `[\n${diffs
      .map(diffItem => buildDiff([diffItem], `[${diffItem.index}]`))
      .join("\n")}\n]`;
  }

  const depth = (parentProperty.match(/\./g) || []).length + 1;
  const padding = new Array(depth).join("  ");

  const deeperDiffs = diffs
    .filter(diffItem => diffItem.path && diffItem.path.length - 1 > depth)
    .reduce(
      (concat, diffItem) => {
        const prop = diffItem.path[depth];
        const value = concat[prop];
        concat[prop] = value ? [...value, diffItem] : [diffItem];
        return concat;
      },
      {} as { [property: string]: Array<deepDiff.IDiff> }
    );

  return (
    `${padding}${diffs[0].path[depth - 1]}: {\n` +
    diffs
      .filter(diffItem => diffItem.path.length - 1 === depth)
      .map(diffItem => stringifyDiffProp(diffItem, padding + "  "))
      .join(",\n") +
    Object.keys(deeperDiffs).map(key =>
      buildDiff(deeperDiffs[key], parentProperty + "." + key)
    ) +
    `\n${padding}}\n`
  );
}

function stringifyDiffProp(diffInfo: deepDiff.IDiff, padding: string) {
  if (diffInfo.kind === "N") {
    return chalk.green(
      `+ ${padding}${diffInfo.path[diffInfo.path.length - 1] ||
        ""}: ${JSON.stringify(diffInfo.rhs)}`
    );
  } else if (diffInfo.kind === "D") {
    return chalk.red(
      `- ${padding}${diffInfo.path[diffInfo.path.length - 1] ||
        ""}: ${JSON.stringify(diffInfo.lhs)}`
    );
  } else if (diffInfo.kind === "E") {
    return `  ${padding}${diffInfo.path[diffInfo.path.length - 1] ||
      ""}: "${diffString(diffInfo.lhs, diffInfo.rhs)}"`;
  }
}
