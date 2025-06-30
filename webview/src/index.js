import { pasteCode } from "./code.js";

let template;

document.addEventListener("paste", (e) => {
    pasteCode(template, e.clipboardData);
});

window.addEventListener("message", (e) => {
    template = e.data;
    document.execCommand("paste");
});
