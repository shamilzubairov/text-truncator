export const hasElementCorrectType = (elem) => (typeof elem === "string") || (!!elem.tagName && elem.nodeType === 1);
