export const replaceLastWord = (re: RegExp, text: string): string => text.replace(re, "$2");

export const removeLastPhrase = (re: RegExp, text: string): string => text.replace(re, "");
