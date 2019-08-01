export async function wait(timeInMilliseconds: number) {
	return new Promise<void>(resolve =>
		setTimeout(resolve, timeInMilliseconds)
	);
}
