import { $, $$ } from "./util.js";

const snippetNode = $("#snippet");

function parseColor(color) {
    if (color.startsWith("rgb")) {
        const [r, g, b] = color.match(/\d+/g);
        return ((1 << 24) + (+r << 16) + (+g << 8) + +b).toString(16).slice(1);
    } else if (color.startsWith("#")) {
        let hex = color.slice(1);
        if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
        return hex;
    }
    return color;
}

const addColor = (hex, colorDefinitions) => {
    if (hex) return colorDefinitions + `\\definecolor{${hex}}{HTML}{${hex}}\n`;
};

const escapeLatex = (text) =>
    text
        .replace(/\u00A0/g, " ") // non-breaking space
        .replace(/\\/g, "\\char92")
        .replace(/{/g, "\\char123")
        .replace(/}/g, "\\char125")
        .replace(/\t/g, "    ");

const setupLines = (node, template, bgColor) => {
    const usedColors = new Set();
    let latexOutput = "";

    Array.from(node.children).forEach(child => {
        if (child.tagName.toLowerCase() === "br") {
            latexOutput += "\n";
        } else if (child.tagName.toLowerCase() === "div") {
            let latexLine = "";
            const spans = $$("span", child);
            spans.forEach(span => {
                const text = span.textContent;
                if (/^\s*$/.test(text)) {
                    latexLine += text;
                    return;
                }
                const hex = parseColor(span.style.color || "black");
                usedColors.add(hex);
                latexLine += `\\textcolor{${hex}}{${escapeLatex(text)}}`;
            });
            latexOutput += latexLine + "\n";
        }
    });
    latexOutput = latexOutput.replace(/\n$/, "");

    let colorDefinitions = "";
    usedColors.forEach(color => {
        colorDefinitions = addColor(color, colorDefinitions);
    });
    colorDefinitions = addColor(bgColor, colorDefinitions);
    colorDefinitions = colorDefinitions.replace(/\n$/, "");

    node.style.whiteSpace = "pre-wrap";
    node.innerHTML = "";
    node.textContent = template
        .replace("DEFINITIONS_PLACEHOLDER", colorDefinitions)
        .replace("BG_COLOR_PLACEHOLDER", bgColor)
        .replace("VERBATIM_PLACEHOLDER", latexOutput);
};

const stripInitialIndent = (node) => {
    const regIndent = /^\s+/u;
    const initialSpans = $$(":scope > div > span:first-child", node);

    initialSpans.forEach((span) => {
        span.textContent = span.textContent.replace(/\t/g, "    ");
    });

    if (initialSpans.some((span) => !regIndent.test(span.textContent))) return;

    const minIndent = Math.min(
        ...initialSpans.map((span) => span.textContent.match(regIndent)[0].length)
    );

    initialSpans.forEach(
        (span) => (span.textContent = span.textContent.slice(minIndent))
    );
};


const getClipboardHtml = (clip) => {
    const html = clip.getData("text/html");
    if (html) return html;
    const text = clip
        .getData("text/plain")
        .split("\n")
        .map((line) => `<div>${line}</div>`)
        .join("");
    return `<div>${text}</div>`;
};

export const pasteCode = (template, clipboard) => {
    snippetNode.innerHTML = getClipboardHtml(clipboard);
    const code = $("div", snippetNode);
    const bgColor = parseColor(code.style.backgroundColor);
    snippetNode.innerHTML = code.innerHTML;
    stripInitialIndent(snippetNode);
    setupLines(snippetNode, template, bgColor);
};
