export const getDomElement = (elem: HTMLElement | string): HTMLElement | null => {
  if (typeof elem === "string") {
    return document.querySelector(elem);
  } else if (typeof elem === "object") {
    return elem;
  } else return null;
}