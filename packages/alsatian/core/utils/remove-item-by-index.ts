export function removeItemByIndex(array: Array<any>, index: number) {
	return array.filter((v, i) => i !== index);
}
