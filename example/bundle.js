const getDomElement = (elem) => {
    if (typeof elem === "string") {
        return document.querySelector(elem);
    }
    else if (typeof elem === "object") {
        return elem;
    }
    else
        return null;
};

const hasElementCorrectType = (elem) => (typeof elem === "string") || (!!elem.tagName && elem.nodeType === 1);

const replaceLastWord = (re, text) => text.replace(re, "$2");
const removeLastPhrase = (re, text) => text.replace(re, "");

const getInnerEnding = (ending) => {
    if (typeof ending === "string") {
        return ending;
    }
    else if (!ending.innerText) {
        return " ";
    }
    return ending.innerText;
};

const getAncestorBottomCoords = (nodeRef, ancestorRef) => {
    let ancestorRefAttr = ancestorRef.tagName.toLowerCase();
    ancestorRefAttr += ancestorRef.id && `#${ancestorRef.id}`;
    ancestorRefAttr += ancestorRef.className && `.${ancestorRef.className}`;
    const closestAncestor = nodeRef.closest(ancestorRefAttr);
    return closestAncestor ? closestAncestor.getBoundingClientRect().bottom : null;
};

function truncator({ sourceNode, sourceAncestor = "body", ending = "...", options = {
    maxLength: Infinity,
    minCutLength: 0,
    delay: 100,
} }) {
    if (!hasElementCorrectType(sourceNode) || !hasElementCorrectType(sourceAncestor) || !hasElementCorrectType(ending)) {
        throw new Error(`${sourceNode}, ${sourceAncestor} and ${ending} must be HTMLElement or string`);
    }
    if (typeof ending !== "string" && !ending.tagName && ending.nodeType !== 1) {
        throw new Error("Ending must string or Node");
    }
    const nodeRef = getDomElement(sourceNode);
    if (nodeRef === null)
        return null;
    const ancestorRef = getDomElement(sourceAncestor);
    if (ancestorRef === null)
        return null;
    const reserve = 5;
    let ancestorBottomCoords = getAncestorBottomCoords(nodeRef, ancestorRef);
    if (ancestorBottomCoords === null)
        return null;
    ancestorBottomCoords -= reserve;
    let rafId = 0;
    let timeout = 0;
    const maxLength = options.maxLength || Infinity;
    const minCutLength = options.minCutLength || 0;
    const delay = options.delay || 100;
    const sourceEnding = " " + (typeof ending === "string" ? ending : ending.outerHTML); // with tags, for final ending
    const innerEndingStringForRe = getInnerEnding(ending).trim(); // without tags, only for RegExp
    const reLastWord = new RegExp(`(\\s*\\S*)(\\s+${(innerEndingStringForRe)})$`);
    const reLastPhrase = new RegExp(`(\\s+${(innerEndingStringForRe)})$`);
    function handleResize() {
        const sourceText = nodeRef.innerText || "";
        return () => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                nodeRef.innerText = sourceText;
                truncateText();
            }, delay);
        };
    }
    const handleResizeClb = handleResize();
    function stopTruncator() {
        window.removeEventListener("resize", handleResizeClb);
        cancelAnimationFrame(rafId);
    }
    window.addEventListener("resize", handleResizeClb);
    window.addEventListener("beforeunload", () => stopTruncator());
    truncateText();
    function truncateText() {
        if (!nodeRef)
            return;
        rafId = requestAnimationFrame(() => {
            const isTextLessThenAncestor = nodeRef.getBoundingClientRect().bottom <= ancestorBottomCoords;
            if (nodeRef.getBoundingClientRect().top > ancestorBottomCoords) {
                nodeRef.innerText = "";
                return;
            }
            if (maxLength && nodeRef.innerText.length > maxLength) {
                nodeRef.innerText = nodeRef.innerText.substr(0, maxLength);
                if (isTextLessThenAncestor) {
                    nodeRef.innerHTML += sourceEnding;
                    return;
                }
            }
            if (isTextLessThenAncestor)
                return;
            nodeRef.innerHTML += sourceEnding;
            while (nodeRef.getBoundingClientRect().bottom > ancestorBottomCoords) {
                nodeRef.innerText = replaceLastWord(reLastWord, nodeRef.innerText);
                if (minCutLength && nodeRef.innerText.length <= minCutLength) {
                    nodeRef.innerText = "";
                    return;
                }
            }
            nodeRef.innerText = removeLastPhrase(reLastPhrase, nodeRef.innerText);
            nodeRef.innerHTML += sourceEnding;
        });
    }
    return stopTruncator;
}

truncator({
    sourceNode: "p",
});
