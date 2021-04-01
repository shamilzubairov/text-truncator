export const stripTags = (elem) => elem.replace(/(<([^>]+)>)/gi, "").trim();
