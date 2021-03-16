"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getDOMElement = function (elem) {
    if (typeof elem === "string") {
        return document.querySelector(elem);
    }
    else if (typeof elem === "object") {
        return elem;
    }
    else
        return null;
};
var getInnerEnding = function (ending) {
    if (typeof ending === "string") {
        return ending;
    }
    else if (!ending.innerText) {
        return " ";
    }
    return ending.innerText;
};
var replaceLastWord = function (re, text) { return text.replace(re, "$2"); };
var removeLastPhrase = function (re, text) { return text.replace(re, ""); };
var getAncestorBottomCoords = function (nodeRef, ancestorRef) {
    var ancestorRefAttr = ancestorRef.tagName.toLowerCase();
    ancestorRefAttr += ancestorRef.id && "#" + ancestorRef.id;
    ancestorRefAttr += ancestorRef.className && "." + ancestorRef.className;
    var closestAncestor = nodeRef.closest(ancestorRefAttr);
    return closestAncestor ? closestAncestor.getBoundingClientRect().bottom : null;
};
var hasElementCorrectType = function (elem) {
    return typeof elem !== "string" && !elem.tagName && elem.nodeType !== 1;
};
/**
 * @param sourceNode {Node | string} исхожный DOM-элемент в котором происходит обрезка текста
 * @param sourceAncestor {Node | string} родитель исходного DOM-элемента, по которому происходит подсчет допустимого текста
 * @param ending {Node | string} окончание текста - может быть либо строкой, либо DOM-элементом
 * @param options {Object} объект с дополнительными параметрами
 * @return {Function}
 */
var truncator = function (_a) {
    var sourceNode = _a.sourceNode, _b = _a.sourceAncestor, sourceAncestor = _b === void 0 ? "body" : _b, ending = _a.ending, _c = _a.options, options = _c === void 0 ? {
        maxLength: Infinity,
        minCutLength: 0,
        delay: 100,
    } : _c;
    if (!hasElementCorrectType(sourceNode) || !hasElementCorrectType(sourceAncestor) || !hasElementCorrectType(ending)) {
        throw new Error(sourceNode + ", " + sourceAncestor + " and " + ending + " must be HTMLElement or string");
    }
    var nodeRef = getDOMElement(sourceNode);
    if (nodeRef === null)
        return null;
    var ancestorRef = getDOMElement(sourceAncestor);
    if (ancestorRef === null)
        return null;
    var reserve = 5;
    var ancestorBottomCoords = getAncestorBottomCoords(nodeRef, ancestorRef);
    if (ancestorBottomCoords === null)
        return null;
    ancestorBottomCoords -= reserve;
    var rafId = 0;
    var timeout = 0;
    var maxLength = options.maxLength || Infinity;
    var minCutLength = options.minCutLength || 0;
    var delay = options.delay || 100;
    if (typeof ending !== "string" && !ending.tagName && ending.nodeType !== 1) {
        throw new Error("Ending must string or Node");
    }
    var sourceEnding = " " + (typeof ending === "string" ? ending : ending.outerHTML); // with tags, for final ending
    var innerEndingStringForRe = getInnerEnding(ending).trim(); // without tags, only for RegExp
    var reLastWord = new RegExp("(\\s*\\S*)(\\s+" + (innerEndingStringForRe) + ")$");
    var reLastPhrase = new RegExp("(\\s+" + (innerEndingStringForRe) + ")$");
    function handleResize() {
        var sourceText = nodeRef.innerText || "";
        return function () {
            clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                nodeRef.innerText = sourceText;
                truncateText();
            }, delay);
        };
    }
    var handleResizeClb = handleResize();
    function closeTruncator() {
        window.removeEventListener("resize", handleResizeClb);
        cancelAnimationFrame(rafId);
    }
    window.addEventListener("resize", handleResizeClb);
    window.addEventListener("beforeunload", function () { return closeTruncator(); });
    truncateText();
    function truncateText() {
        if (!nodeRef)
            return;
        rafId = requestAnimationFrame(function () {
            var isTextLessThenAncestor = nodeRef.getBoundingClientRect().bottom <= ancestorBottomCoords;
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
    return closeTruncator;
};
exports.default = truncator;
//# sourceMappingURL=index.js.map