export const getInnerEnding = (ending) => {
    if (typeof ending === "string") {
        return ending;
    }
    else if (!ending.innerText) {
        return " ";
    }
    return ending.innerText;
};
