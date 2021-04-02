import { getDomElement } from "./utils/getDomElement";
import { hasElementCorrectType } from "./utils/hasElementCorrectType";
import { replaceLastWord, removeLastPhrase } from "./utils/re";
import { removeSpecChars } from "./utils/removeSpecChars";
import { getInnerEnding } from "./utils/getInnerEnding";
import { getAncestorBottomCoords } from "./utils/getAncestorBottomCoords";
export default function truncator({ sourceNode, sourceAncestor = "body", ending = "...", options = {
    maxLength: Infinity,
    minCutLength: 0,
    delay: 100,
} }) {
    if (!hasElementCorrectType(sourceNode) || !hasElementCorrectType(sourceAncestor) || !hasElementCorrectType(ending)) {
        console.error(`${sourceNode}, ${sourceAncestor} and ${ending} must be HTMLElement or string`);
        return null;
    }
    const nodeRef = getDomElement(sourceNode);
    const ancestorRef = getDomElement(sourceAncestor);
    if (nodeRef === null || ancestorRef === null) {
        console.error(`${sourceNode} or ${sourceAncestor} are not DOM elements`);
        return null;
    }
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
    const sourceEnding = " " + (typeof ending === "string" ? removeSpecChars(ending) : ending.outerHTML); // with tags, for final ending
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
                ;
            }
            if (isTextLessThenAncestor)
                return;
            nodeRef.innerHTML += sourceEnding;
            while (nodeRef.getBoundingClientRect().bottom > ancestorBottomCoords) {
                const nodeRefBeforeTruncate = nodeRef.innerText;
                nodeRef.innerText = replaceLastWord(reLastWord, nodeRef.innerText);
                // defensive of the infinite loop
                if (nodeRefBeforeTruncate.length <= nodeRef.innerText.length)
                    return;
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
;
