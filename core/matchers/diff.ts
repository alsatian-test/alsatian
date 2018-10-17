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

  if (diffs.every(d => !d.added && !d.removed)) {
    return "no differences";
  }

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
  const padding = new Array(depth + 1).join("  ");

  const deeperDiffs = diffs
    .filter(diffItem => diffItem.path && diffItem.path.length > depth)
    .reduce(
      (concat, diffItem) => {
        const prop = diffItem.path[depth];
        const value = concat[prop];
        concat[prop] = value ? [...value, diffItem] : [diffItem];
        return concat;
      },
      {} as { [property: string]: Array<deepDiff.IDiff> }
    );

  const properties = diffs
    .filter(diffItem => diffItem.path.length === depth)
    .map(diffItem => stringifyDiffProp(diffItem, padding))
    .concat(
      Object.keys(deeperDiffs).map(key => {
        const diffItems = deeperDiffs[key];
        return `  ${padding}${diffItems[0].path[depth - 1]}: ${buildDiff(
          diffItems,
          parentProperty + "." + key
        )}`;
      })
    )
    .join(",\n");

  return `{\n` + properties + `\n${depth === 1 ? "" : padding}}`;
}

function buildDiffProp(diffInfo: deepDiff.IDiff, value: any, padding: string) {
  return `${padding}${diffInfo.path[diffInfo.path.length - 1] || ""}: ${
    typeof value === "string" ? `"${value}"` : JSON.stringify(value)
  }`;
}

function stringifyDiffProp(diffInfo: deepDiff.IDiff, padding: string) {
  if (diffInfo.kind === "N") {
    return chalk.green(`+ ${buildDiffProp(diffInfo, diffInfo.rhs, padding)}`);
  } else if (diffInfo.kind === "D") {
    return chalk.red(`- ${buildDiffProp(diffInfo, diffInfo.lhs, padding)}`);
  } else if (diffInfo.kind === "E") {
    return `  ${buildDiffProp(
      diffInfo,
      diffString(diffInfo.lhs, diffInfo.rhs),
      padding
    )}`;
  }
}
