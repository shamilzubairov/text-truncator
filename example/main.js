import tc from "./dist/index.js";

tc({
    sourceNode: "p",
    sourceAncestor: ".app",
    ending: "read more...",
    options: {
        once: true
    }
})