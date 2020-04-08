import { GeneratorBuilder } from "./generator-builder";

export class Strings {
    private static numbers = [..."0123456789"];
    private static upperLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    private static lowerLetters = [..."abcdefghijklmnopqrstuvwxyz"];
    private static uniqueChars = [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?"`];

    static Falsy = function* () {
        yield "";
        yield null;
        yield undefined;
    }

    static OfLength(options?: { between?: { minLength?: number, maxLength?: number }, charset?: string}) {
        const minLength = options?.between?.minLength ?? 0;

        // The official longest word in the world contains 189819 letters. And it's chemical name of titin, the largest known protein.
        // I'm pretty sure that we don't want to use is as default. https://en.wikipedia.org/wiki/Longest_word_in_English
        const maxLength = options?.between?.maxLength ?? 182;
        const charset = [...options?.charset] ?? [...this.numbers, ...this.upperLetters, ...this.lowerLetters, ...this.uniqueChars];
       
        return new GeneratorBuilder(() => [...Array(Math.floor(Math.random() * maxLength + minLength))].map(e => charset[Math.random() * charset.length | 0]).join(""));
    }
}
