(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./utils/getDomElement", "./utils/hasElementCorrectType", "./utils/re", "./utils/getInnerEnding", "./utils/getAncestorBottomCoords"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getDomElement_1 = require("./utils/getDomElement");
    var hasElementCorrectType_1 = require("./utils/hasElementCorrectType");
    var re_1 = require("./utils/re");
    var getInnerEnding_1 = require("./utils/getInnerEnding");
    var getAncestorBottomCoords_1 = require("./utils/getAncestorBottomCoords");
    var truncator = function (_a) {
        var sourceNode = _a.sourceNode, _b = _a.sourceAncestor, sourceAncestor = _b === void 0 ? "body" : _b, ending = _a.ending, _c = _a.options, options = _c === void 0 ? {
            maxLength: Infinity,
            minCutLength: 0,
            delay: 100,
        } : _c;
        if (!hasElementCorrectType_1.hasElementCorrectType(sourceNode) || !hasElementCorrectType_1.hasElementCorrectType(sourceAncestor) || !hasElementCorrectType_1.hasElementCorrectType(ending)) {
            throw new Error(sourceNode + ", " + sourceAncestor + " and " + ending + " must be HTMLElement or string");
        }
        if (typeof ending !== "string" && !ending.tagName && ending.nodeType !== 1) {
            throw new Error("Ending must string or Node");
        }
        var nodeRef = getDomElement_1.getDomElement(sourceNode);
        if (nodeRef === null)
            return null;
        var ancestorRef = getDomElement_1.getDomElement(sourceAncestor);
        if (ancestorRef === null)
            return null;
        var reserve = 5;
        var ancestorBottomCoords = getAncestorBottomCoords_1.getAncestorBottomCoords(nodeRef, ancestorRef);
        if (ancestorBottomCoords === null)
            return null;
        ancestorBottomCoords -= reserve;
        var rafId = 0;
        var timeout = 0;
        var maxLength = options.maxLength || Infinity;
        var minCutLength = options.minCutLength || 0;
        var delay = options.delay || 100;
        var sourceEnding = " " + (typeof ending === "string" ? ending : ending.outerHTML); // with tags, for final ending
        var innerEndingStringForRe = getInnerEnding_1.getInnerEnding(ending).trim(); // without tags, only for RegExp
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
        function stopTruncator() {
            window.removeEventListener("resize", handleResizeClb);
            cancelAnimationFrame(rafId);
        }
        window.addEventListener("resize", handleResizeClb);
        window.addEventListener("beforeunload", function () { return stopTruncator(); });
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
                    nodeRef.innerText = re_1.replaceLastWord(reLastWord, nodeRef.innerText);
                    if (minCutLength && nodeRef.innerText.length <= minCutLength) {
                        nodeRef.innerText = "";
                        return;
                    }
                }
                nodeRef.innerText = re_1.removeLastPhrase(reLastPhrase, nodeRef.innerText);
                nodeRef.innerHTML += sourceEnding;
            });
        }
        return stopTruncator;
    };
    exports.default = truncator;
});
//# sourceMappingURL=index.js.map