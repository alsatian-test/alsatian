import { join, relative, dirname } from "path";
import { stat, exists, Stats } from "fs";

async function statAsync(file: string): Promise<Stats> {
    return new Promise((resolve, reject) => {
        stat(file, (error, stats) => error ? reject(error) : resolve(stats));
    });
}

async function existsAsync(file: string) {    
    return new Promise(resolve => {
        exists(file, (fileExists) => resolve(fileExists));
    });
}

export async function findNearestFile(fileName: string, directory?: string) {
  
    if (!fileName) {
        throw new TypeError("fileName is required.");
    }
  
    if (fileName.includes("/") || fileName === "..") {
        throw new TypeError("fileName must be just a file, not a path or a file with a path.");
    }

    directory = directory || process.cwd();

    while (relative(directory, "/") !== "") {
        const file = join(directory, fileName);

        const fileExists = await existsAsync(file);

        if (fileExists) {
            const fileStats = await statAsync(file);

            if (fileStats.isFile()) {
                return file;
            }
        }

        directory = dirname(directory);
    }

    return null;
}
