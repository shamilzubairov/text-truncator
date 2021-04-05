import tc from "./dist/index.js";

const anchor = document.createElement("a");
anchor.href = "https://ya.ru";
anchor.target = "_blank";
anchor.innerHTML = "read more...";

tc({
    sourceNode: "p",
    ending: anchor,
});