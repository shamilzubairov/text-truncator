export const hasElementCorrectType = (elem: HTMLElement | string): boolean =>
  (typeof elem === "string") || (!!elem.tagName && elem.nodeType === 1)