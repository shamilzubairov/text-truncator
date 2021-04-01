import { removeSpecChars } from "./removeSpecChars";
export const getDomElement = (elem) => {
    if (typeof elem === "string") {
        return document.querySelector(removeSpecChars(elem));
    }
    else if (typeof elem === "object") {
        return elem;
    }
    else
        return null;
};
