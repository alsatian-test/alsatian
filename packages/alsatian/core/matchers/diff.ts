import { diffChars, diffWords } from "diff";
import { diff as deepDiff } from "deep-diff";
import chalk from "chalk";

export function diff(firstItem: any, secondItem: any) {
	if (typeof firstItem === "string") {
		return diffString(firstItem, secondItem);
	}

	const diffs = deepDiff(firstItem, secondItem) || [];

	return buildDiff(diffs);
}

function diffString(firstString: string, secondString: string) {
	if (firstString === secondString) {
		return "no differences";
	} else if (!firstString) {
		return chalk.green(secondString);
	} else if (!secondString) {
		return chalk.red(firstString);
	}

	const diffs =
		/\s/.test(firstString) || /\s/.test(secondString)
			? diffWords(firstString, secondString)
			: diffChars(firstString, secondString);

	return diffs.map(styleDiffItem).join("");
}

function styleDiffItem(diffItem: JsDiff.IDiffResult) {
	if (diffItem.added) {
		return chalk.green(diffItem.value);
	}

	if (diffItem.removed) {
		return chalk.red(diffItem.value);
	}

	return diffItem.value;
}

function buildDiff(diffs: Array<deepDiff.IDiff>) {
	if (diffs.every(d => d.path === undefined)) {
		return buildNonObjectDiff(diffs);
	}

	return buildObjectDiff(diffs);
}

function buildNonObjectDiff(diffs: Array<deepDiff.IDiff>): string {
	if (diffs.length === 0) {
		return "no differences";
	} else if (diffs.length === 1) {
		const onlyDiff = diffs[0];

		return diffString(
			JSON.stringify(onlyDiff.lhs),
			JSON.stringify(onlyDiff.rhs)
		);
	}
	// probably an array
	else {
		return `[\n${diffs
			.map(diffItem => buildDiff([diffItem]))
			.join("\n")}\n]`;
	}
}

function buildObjectDiff(
	diffs: Array<deepDiff.IDiff>,
	depth: number = 1
): string {
	const padding = new Array(depth + 1).join("  ");

	const deeperDiffs = groupDiffsByProperty(diffs, depth);

	const properties = diffs
		.filter(diffItem => diffItem.path.length === depth)
		.map(diffItem => stringifyDiffProp(diffItem, padding))
		.concat(
			Object.keys(deeperDiffs).map(key => {
				const diffItems = deeperDiffs[key];
				return `  ${padding}${
					diffItems[0].path[depth - 1]
				}: ${buildObjectDiff(diffItems, depth + 1)}`;
			})
		)
		.join(",\n");

	return `{\n` + properties + `\n${depth === 1 ? "" : padding}}`;
}

function groupDiffsByProperty(diffs: Array<deepDiff.IDiff>, depth: number) {
	return diffs
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
}

function buildDiffProp(diffInfo: deepDiff.IDiff, value: any, padding: string) {
	return `${padding}${diffInfo.path[diffInfo.path.length - 1] || ""}: ${
		typeof value === "string" ? `"${value}"` : JSON.stringify(value)
	}`;
}

function stringifyDiffProp(diffInfo: deepDiff.IDiff, padding: string) {
	if (diffInfo.kind === "N") {
		return chalk.green(
			`+ ${buildDiffProp(diffInfo, diffInfo.rhs, padding)}`
		);
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
