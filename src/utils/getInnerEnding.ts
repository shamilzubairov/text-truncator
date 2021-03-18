export const getInnerEnding = (ending: HTMLElement | string): string => {
  if (typeof ending === "string") {
    return ending;
  } else if (!ending.innerText) {
    return " ";
  }
  return ending.innerText;
}