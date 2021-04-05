import { getDomElement } from "./utils/getDomElement";
import { hasElementCorrectType } from "./utils/hasElementCorrectType";
import { replaceLastWord, removeLastPhrase } from "./utils/re";
import { removeSpecChars } from "./utils/removeSpecChars";
import { getInnerEnding } from "./utils/getInnerEnding";
import { getAncestorBottomCoords } from "./utils/getAncestorBottomCoords";
export default function truncator({ sourceNode, sourceAncestor = "body", ending = "...", options = {} }) {
    var _a, _b, _c, _d;
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
    const maxLength = (_a = options.maxLength) !== null && _a !== void 0 ? _a : Infinity;
    const minCutLength = (_b = options.minCutLength) !== null && _b !== void 0 ? _b : 50;
    const delay = (_c = options.delay) !== null && _c !== void 0 ? _c : 100;
    const once = (_d = options.once) !== null && _d !== void 0 ? _d : false;
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
    if (!once) {
        window.addEventListener("resize", handleResizeClb);
    }
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
                // infinite loop protection
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
