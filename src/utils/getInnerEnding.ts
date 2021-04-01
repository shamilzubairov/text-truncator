import { removeSpecChars } from "./removeSpecChars";

export const getInnerEnding = (ending: HTMLElement | string): string => {
  if (typeof ending === "string") {
    return removeSpecChars(ending);
  } else if (!ending.innerText) {
    return " ";
  }
  return ending.innerText;
}