export function clearRequireCache(fileNames: Array<string>) {
    fileNames.forEach(fileName => {
        delete require.cache[fileName];
    });
}
